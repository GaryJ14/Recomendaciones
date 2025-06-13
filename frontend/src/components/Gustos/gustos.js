import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { listarEtiquetas, guardarPreferencias } from "../../services/GustosApi";

const coloresPorGenero = {
  Rock: { color: "#F28B82", bgColor: "#FDECEA" },
  Pop: { color: "#F8BBD0", bgColor: "#FDECF3" },
  Jazz: { color: "#8AB4F8", bgColor: "#E8F0FE" },
  "Hip Hop": { color: "#C58AF9", bgColor: "#F3E8FE" },
  Electrónica: { color: "#8AB4F8", bgColor: "#E8F0FE" },
  Reggaeton: { color: "#81C995", bgColor: "#E9F8EE" },
  Salsa: { color: "#F9D67A", bgColor: "#FEF7E0" },
  Blues: { color: "#8AB4F8", bgColor: "#E8F0FE" },
  Country: { color: "#F9D67A", bgColor: "#FEF7E0" },
  Reggae: { color: "#81C995", bgColor: "#E9F8EE" },
  Folk: { color: "#F9D67A", bgColor: "#FEF7E0" },
  Clásica: { color: "#C58AF9", bgColor: "#F3E8FE" },
};

export default function Gustos() {
  const [generos, setGeneros] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    setCargando(true);
    listarEtiquetas()
      .then((data) => {
        setGeneros(data);
        setError(null);
      })
      .catch((e) => {
        if (e.message.includes("No autorizado") || e.message.includes("token")) {
          setError("No autorizado. El token puede estar expirado o inválido.");
        } else {
          setError(`Error al cargar etiquetas: ${e.message}`);
        }
      })
      .finally(() => setCargando(false));
  }, []);

  const toggleGenero = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const limpiarTodo = () => setSeleccionados([]);

  const handleGuardar = () => {
    if (seleccionados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Selecciona al menos un género antes de guardar.",
      });
      return;
    }

    guardarPreferencias(seleccionados)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Preferencias guardadas",
          text: res.mensaje || "Tus preferencias se guardaron correctamente.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/Home");
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `No se pudo guardar preferencias: ${e.message}`,
        });
      });
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 700,
        margin: "40px auto",
        backgroundColor: "#f9fafb",
        padding: 30,
        borderRadius: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        color: "#333",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
          padding: 10,
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              backgroundColor: "#b9a5f0",
              borderRadius: "50%",
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#5f40a1",
              fontSize: 28,
              boxShadow: "0 2px 10px rgba(185,165,240,0.5)",
            }}
          >
            🎵
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontWeight: "900",
                fontSize: "2.5rem",
                color: "#4a3fbf",
                letterSpacing: "0.05em",
              }}
            >
              Gustos Musicales
            </h1>
            <p style={{ margin: 0, color: "#666", fontSize: "1.1rem" }}>
              Personaliza tu experiencia musical
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          <button
            onClick={limpiarTodo}
            style={{
              border: "none",
              padding: "10px 18px",
              borderRadius: 12,
              cursor: "pointer",
              backgroundColor: "#ddd",
              color: "#555",
              fontWeight: "700",
              fontSize: "1rem",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#bbb")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ddd")}
          >
            Limpiar Todo
          </button>
          <button
            onClick={handleGuardar}
            style={{
              border: "none",
              padding: "10px 22px",
              borderRadius: 12,
              cursor: "pointer",
              backgroundColor: "#6e54f7",
              color: "white",
              fontWeight: "800",
              fontSize: "1rem",
              boxShadow: "0 6px 15px rgba(110, 84, 247, 0.6)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#553de0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6e54f7")}
          >
            Guardar Preferencias
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 30,
            padding: 16,
            backgroundColor: "#ffe2e6",
            color: "#9a1f2f",
            borderRadius: 10,
            fontWeight: "600",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(255,0,0,0.1)",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {cargando && (
        <p
          style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            textAlign: "center",
            color: "#555",
          }}
        >
          Cargando géneros...
        </p>
      )}

      {/* Géneros */}
      {!cargando && !error && (
        <section>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "1.6rem",
              color: "#4a3fbf",
              marginBottom: 14,
              fontWeight: "700",
              letterSpacing: "0.02em",
            }}
          >
            🎵 Géneros Musicales
          </h3>
          <p
            style={{
              color: "#555",
              fontSize: "1.05rem",
              marginBottom: 20,
              fontWeight: "600",
            }}
          >
            Selecciona los géneros que más te gustan (
            <span style={{ color: "#6e54f7" }}>{seleccionados.length}</span>{" "}
            seleccionados)
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            {generos.map(({ id, nombre }) => {
              const { color, bgColor } = coloresPorGenero[nombre] || {
                color: "#000000",
                bgColor: "#eeeeee",
              };
              const seleccionado = seleccionados.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleGenero(id)}
                  style={{
                    cursor: "pointer",
                    border: `2.5px solid ${color}`,
                    backgroundColor: seleccionado ? color : bgColor,
                    color: seleccionado ? "white" : color,
                    padding: "12px 24px",
                    borderRadius: 30,
                    fontWeight: "700",
                    fontSize: "1.05rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    userSelect: "none",
                    transition: "all 0.3s ease",
                    boxShadow: seleccionado ? `0 0 15px ${color}` : "none",
                    minWidth: 110,
                    justifyContent: "center",
                    textTransform: "capitalize",
                  }}
                >
                  <span role="img" aria-label="nota musical">
                    🎵
                  </span>{" "}
                  {nombre}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
