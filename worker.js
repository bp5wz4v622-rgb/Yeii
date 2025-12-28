export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Configuración de CORS para permitir que la web se comunique con la API
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Manejo de peticiones previas (pre-flight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // RUTA: Obtener noticias guardadas
    if (url.pathname === "/noticias" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM noticias ORDER BY fecha DESC").all();
        return Response.json(results, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
      }
    }

    // RUTA: Guardar una nueva noticia (Solo Staff)
    if (url.pathname === "/publicar" && request.method === "POST") {
      const { titulo, contenido, autor } = await request.json();
      await env.DB.prepare(
        "INSERT INTO noticias (titulo, contenido, autor, fecha) VALUES (?, ?, ?, ?)"
      ).bind(titulo, contenido, autor, new Date().toISOString()).run();
      
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    return new Response("To' Revuelto API funcionando", { headers: corsHeaders });
  },
};

