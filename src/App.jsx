import { useState } from "react";
import "./App.css";

function App() {
  const [characterName, setCharacterName] = useState("");
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchCharacter = async () => {
    if (!characterName.trim()) {
      setError("請輸入角色名稱");
      setCharacterData(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCharacterData(null);

      const response = await fetch(
        `http://localhost:8080/character/${encodeURIComponent(characterName)}`
      );

      if (!response.ok) {
        throw new Error("查詢失敗");
      }

      const data = await response.json();
      setCharacterData(data);
    } catch (err) {
      setError("查不到角色資料，或後端發生錯誤");
      setCharacterData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchCharacter();
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
        
        <h2 className="text-center mb-3">MapleStory 角色查詢</h2>
        <p className="text-center text-muted">
          輸入角色名稱，查詢角色資訊
        </p>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="請輸入角色名稱"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={searchCharacter}
          disabled={loading}
        >
          {loading ? "查詢中..." : "查詢"}
        </button>

        {error && (
          <div className="alert alert-danger mt-3 text-center">
            {error}
          </div>
        )}

        {characterData && (
          <div className="card mt-4 p-3">
            <div className="d-flex gap-3 align-items-center">

              {characterData.character_image && (
                <img
                  src={characterData.character_image}
                  alt={characterData.character_name}
                  style={{ width: "80px" }}
                />
              )}

              <div>
                <h5>{characterData.character_name || "未知角色"}</h5>
                <p className="mb-1">世界：{characterData.world_name || "未知"}</p>
                <p className="mb-1">職業：{characterData.character_class || "未知"}</p>
                <p className="mb-1">等級：{characterData.character_level || "未知"}</p>
                <p className="mb-1">公會：{characterData.character_guild_name || "無"}</p>
                <p className="mb-0">性別：{characterData.character_gender || "未知"}</p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;