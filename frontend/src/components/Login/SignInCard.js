import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { SitemarkIcon } from "./CustomIcons";
import { login } from "../../services/api";
import Swal from "sweetalert2";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignInCard() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Login Component (Asegúrate de que el ID se guarda en localStorage)
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    try {
      const data = await login(email, password); // Llamada al servicio login

      // Almacenar el token JWT y el ID en localStorage
      localStorage.setItem("access_token", data.access_token);  // Token de acceso
      localStorage.setItem("user_id", data.id);  // Almacena el ID
      localStorage.setItem("nombre", data.nombre); // Nombre
      localStorage.setItem("email", data.email); // Email
      localStorage.setItem("foto_perfil", data.foto_perfil); // Foto de perfil

      Swal.fire({
        title: "Bienvenido!",
        text: data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });

      // Redirigir según el rol del usuario
      if (data.role === "superadmin") {
        window.location.href = "/Dashboard";
      } else if (data.role === "admin") {
        window.location.href = "/Dashboard";
      } else {
        window.location.href = "/Home";
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Hubo un error en el servidor. Intenta más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };



  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Por favor ingresar un email correcto.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Por favor ingresar una contraseña válida.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Iniciar sesión
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Correo</FormLabel>
          <TextField
            error={Boolean(emailError)}
            helperText={emailError}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "baseline" }}
            >
              Olvidaste la contraseña?
            </Link>
          </Box>
          <TextField
            error={Boolean(passwordError)}
            helperText={passwordError}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Recordar contraseña"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained">
          Iniciar sesión
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          No tienes una cuenta?{" "}
          <span>
            <Link href="/SignUp" variant="body2" sx={{ alignSelf: "center" }}>
              Regístrate
            </Link>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
