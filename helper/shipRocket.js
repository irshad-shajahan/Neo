const { default: axios } = require("axios");
const tokenModel = require("../models/tokenModel");

function generateToken() {
  return new Promise((resolve, reject) => {
    axios
      .post("https://apiv2.shiprocket.in/v1/external/auth/login", {
        email: "neoproducts24@gmail.com",
        password: "Neoproducts2024",
      })
      .then(async (res) => {
        if (res.data.token) {
          const token = await tokenModel.findOne();
          if (token) {
            token.token = res.data.token;
            await token.save();
          } else {
            const newToken = new tokenModel({ token: res.data.token });
            await newToken.save();
          }
          resolve(res.data.token);
        } else {
          reject(new Error("Token not found in response"));
        }
      })
      .catch((postErr) => {
        reject(postErr);
      });
  });
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

module.exports = {
  createShipRocketOrder: async (order) => {
    console.log(order);
    return new Promise(async (resolve, reject) => {
      console.log("entered create ship rocket");
      const storedToken = await tokenModel.findOne();
      const orderData = {
        order_id: order?._id,
        order_date: formatDate(order?.createdAt),
        pickup_location: "Primary",
        channel_id: "",
        billing_customer_name: order?.firstName,
        billing_last_name: order?.lastName,
        billing_address: order?.address,
        // billing_address_2: "Near Hokage House",
        billing_city: order?.town,
        billing_pincode: order?.pincode,
        billing_state: order?.state,
        billing_country: "India",
        billing_email: order?.email,
        billing_phone: order?.phone,
        shipping_is_billing: true,
        shipping_customer_name: "",
        shipping_last_name: "",
        shipping_address: "",
        shipping_address_2: "",
        shipping_city: "",
        shipping_pincode: "",
        shipping_country: "",
        shipping_state: "",
        shipping_email: "",
        shipping_phone: "",
        order_items: order?.lineItems.map((elem) => {
          return {
            name: elem.name,
            sku: elem._id,
            units: elem.quantity,
            selling_price: elem.price,
            discount: "",
            tax: "",
            hsn: "",
          };
        }),
        payment_method: "Prepaid",
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: order?.total,
        length: 10,
        breadth: 15,
        height: 20,
        weight: 0.5, // Add the missing weight property
      };
      function orderApi(token) {
        axios
          .post(
            "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
            orderData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            //   console.log("Order created successfully:", response.data);
            console.log(response.data);
            console.log('===========================')
            resolve();
          })
          .catch(async (error) => {
            console.log('enteredt err')
            if (error.response && error.response.status === 401) {
              console.log("Unauthorized, generating new token...");
              const newToken = await generateToken();
              orderApi(newToken);
            } else {
                console.log('+++++++++++++++++++++++++')
              reject();
              console.error(
                "Error creating order:",
                error.response ? error.response.data : error.message
              );
            }
          });
      }
      if (storedToken) {
        console.log("token ind");
        orderApi(storedToken.token);
      } else {
        console.log("no token");
        generateToken().then((token) => {
          orderApi(token);
        });
      }
    });
  },
};
