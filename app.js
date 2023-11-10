const msal = require("@azure/msal-node");
const axios = require("axios");
const express = require("express");
const app = express();

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud

const config = {
  auth: {
    clientId: "TU_APP_ID",
    authority: "https://login.microsoftonline.com/TU_TENANT_ID",
    clientSecret: "TU_APP_SECRET",
  },
};

const cca = new msal.ConfidentialClientApplication(config);

const clientCredentialRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};

app.post("/resetPassword", (req, res) => {
  const userId = req.body.userId; // Obtener el ID del usuario del cuerpo de la solicitud
  cca
    .acquireTokenByClientCredential(clientCredentialRequest)
    .then((response) => {
      axios
        .post(
          `https://graph.microsoft.com/v1.0/users/${userId}/resetPassword`,
          {
            passwordProfile: {
              forceChangePasswordNextSignIn: true,
              password: "NuevaContraseña123",
            },
          },
          {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error al restablecer la contraseña");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error al obtener el token de acceso");
    });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});


