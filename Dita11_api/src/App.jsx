import React, { useEffect, useState } from "react";

 function Weather() {
  const [query, setQuery] = useState("Prizren");
  const [place, setPlace] = useState(null); // { name, country, latitude, longitude, timezone }
  const [current, setCurrent] = useState(null); // { temperature, windspeed, weathercode, time }
  const [daily, setDaily] = useState(null); // { time[], temperature_2m_max[], temperature_2m_min[], precipitation_sum[] }
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // load default city once
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weatherCodeToText = (code) => {
    const map = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return map[code] ?? `Code ${code}`;
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const name = query?.trim();
    if (!name) return;
    setLoading(true);
    setErr("");
    setPlace(null);
    setCurrent(null);
    setDaily(null);

    try {
      // 1) Geocoding to get lat/lon
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          name
        )}&count=1&language=en&format=json`
      );
      if (!geoRes.ok) throw new Error(`Geocoding HTTP ${geoRes.status}`);
      const geo = await geoRes.json();

      if (!geo.results || geo.results.length === 0) {
        throw new Error("Nuk u gjet asnjë qytet me këtë emër.");
      }

      const g = geo.results[0];
      const meta = {
        name: g.name,
        country: g.country,
        latitude: g.latitude,
        longitude: g.longitude,
        timezone: g.timezone,
      };

      // 2) Weather forecast
      const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${meta.latitude}&longitude=${meta.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      const wxRes = await fetch(wxUrl);
      if (!wxRes.ok) throw new Error(`Forecast HTTP ${wxRes.status}`);
      const wx = await wxRes.json();

      setPlace(meta);
      setCurrent(wx.current_weather);
      setDaily(wx.daily);
    } catch (error) {
      setErr(error.message || "Diçka shkoi keq.");
    } finally {
      setLoading(false);
    }
  };

  const card = {
    maxWidth: 800,
    margin: "24px auto",
    padding: 16,
    borderRadius: 12,
    background: "#111827",
    color: "#e5e7eb",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  };

  const inputStyles = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #374151",
    background: "#0b1220",
    color: "#e5e7eb",
    outline: "none",
  };

  const button = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#e5e7eb",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 12,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", padding: 16 }}>
      <div style={card}>
        <h1 style={{ margin: "0 0 12px", fontSize: 22 }}>🌤️ Weather (Open-Meteo)</h1>

        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}
        >
          <input
            placeholder="Shkruaj qytetin… p.sh. Prizren"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={inputStyles}
          />
          <button type="submit" style={button} disabled={loading}>
            {loading ? "Duke kërkuar…" : "Kërko"}
          </button>
        </form>

        {err && (
          <div
            style={{
              background: "#7f1d1d",
              color: "#fecaca",
              padding: "10px 12px",
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            ⚠️ {err}
          </div>
        )}

        {!loading && place && current && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #1f2937",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>
                📍 {place.name}, {place.country}
              </h2>
              <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 8 }}>
                {place.latitude.toFixed(2)}°, {place.longitude.toFixed(2)}° · TZ: {place.timezone}
              </div>

              <div style={grid}>
                <div
                  style={{
                    background: "#0b1220",
                    border: "1px solid #1f2937",
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 700 }}>
                    {Math.round(current.temperature)}°C
                  </div>
                  <div style={{ opacity: 0.9 }}>{weatherCodeToText(current.weathercode)}</div>
                  <div style={{ opacity: 0.7, fontSize: 13, marginTop: 6 }}>
                    ⏱ {new Date(current.time).toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    background: "#0b1220",
                    border: "1px solid #1f2937",
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: 14, opacity: 0.8 }}>Wind</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{current.windspeed} km/h</div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#0f172a",
                border: "1px solid #1f2937",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>📅 5-ditët në vijim</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {daily.time.slice(0, 5).map((d, i) => (
                  <div
                    key={d}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: 8,
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: "#0b1220",
                      border: "1px solid #1f2937",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ opacity: 0.9 }}>
                      {new Date(d).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      {Math.round(daily.temperature_2m_min[i])}° /{" "}
                      {Math.round(daily.temperature_2m_max[i])}°
                    </div>
                    <div style={{ opacity: 0.8, fontSize: 13 }}>
                      🌧 {Math.round(daily.precipitation_sum[i] ?? 0)} mm
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}x

        {loading && (
          <div style={{ marginTop: 12, opacity: 0.8 }}>Duke ngarkuar të dhënat e motit…</div>
        )}

        {!loading && !place && !err && (
          <div style={{ marginTop: 12, opacity: 0.8 }}>Kërko një qytet për të parë motin.</div>
        )}

        <div style={{ marginTop: 14, opacity: 0.5, fontSize: 12 }}>
          Burimi: Open-Meteo (pa API key) · Ky është thjesht një demo edukative.
        </div>
      </div>
    </div>
  );
}

export default Weather;
