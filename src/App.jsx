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
        `http://localhost:8080/character/${encodeURIComponent(characterName)}/profile`
      );

      if (!response.ok) {
        throw new Error("查詢失敗");
      }
      const res = await response.json();
      setCharacterData(res.data);
      console.log("API 回傳資料：", res);
      console.log("角色資料：", res.data.basic);
      console.log("裝備資料：", res.data.equipment);
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
    <div className="app-shell">
      <div className="hero-card">
        <div>
          <p className="eyebrow">MapleStory 角色查詢</p>
          <h1>查詢玩家資料</h1>
          <p className="hero-description">
            輸入角色名稱，快速取得角色大廳顯示的角色資訊和屬性總覽。
          </p>
        </div>

        <div className="search-panel">
          <div className="search-input-wrap">
            <input
              type="text"
              placeholder="請輸入角色名稱"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button onClick={searchCharacter} disabled={loading}>
              {loading ? "查詢中..." : "查詢"}
            </button>
          </div>
          {error && <div className="error-banner">{error}</div>}
        </div>
      </div>

      {characterData && (
        <div className="dashboard-grid">
          <section className="profile-card card-panel">
            <div className="profile-top">
              <div className="avatar-shell">
                {characterData.basic.character_image ? (
                  <img
                    className="avatar"
                    src={characterData.basic.character_image}
                    alt={characterData.basic.character_name}
                  />
                ) : (
                  <div className="avatar-placeholder">?</div>
                )}
              </div>
              <div>
                <p className="badge">{characterData.basic.character_class || "未知職業"}</p>
                <h2>{characterData.basic.character_name || "未知角色"}</h2>
                <p className="subtext">{characterData.basic.world_name || "未知世界"}</p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span>等級</span>
                <strong>{characterData.basic.character_level || "-"}</strong>
              </div>
              <div className="stat-item">
                <span>職業</span>
                <strong>{characterData.basic.character_class || "未知"}</strong>
              </div>
              <div className="stat-item">
                <span>轉數</span>
                <strong>{characterData.basic.character_class_level || "-"}</strong>
              </div>
            </div>

            <div className="profile-meta">
              <div>
                <p>公會</p>
                <strong>{characterData.basic.character_guild_name || "無"}</strong>
              </div>
              <div>
                <p>登入狀態</p>
                <strong>
                  {characterData.basic.access_flag === "true" ? "可登入" : "限制"}
                </strong>
              </div>
              <div>
                <p>解放任務</p>
                <strong>
                  {characterData.basic.liberation_quest_clear === "true"
                    ? "已完成"
                    : "未完成"}
                </strong>
              </div>
            </div>
          </section>

          <section className="stats-card card-panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">屬性總覽</p>
                <h2>核心數值</h2>
              </div>
              <span className="status-pill">
                {characterData.basic.character_gender || "未知性別"}
              </span>
            </div>

            <div className="stats-list">
              <div className="stats-row">
                <span>世界</span>
                <strong>{characterData.basic.world_name || "-"}</strong>
              </div>
              <div className="stats-row">
                <span>創角日期</span>
                <strong>{characterData.basic.character_date_create || "-"}</strong>
              </div>
              <div className="stats-row">
                <span>經驗值</span>
                <strong>
                  {characterData.basic.character_exp
                    ? characterData.basic.character_exp.toLocaleString()
                    : "-"}
                </strong>
              </div>
              <div className="stats-row">
                <span>經驗%</span>
                <strong>{characterData.basic.character_exp_rate || "-"}%</strong>
              </div>
              <div className="stats-row">
                <span>攻擊力 / 魔攻</span>
                <strong>2,722 / 777</strong>
              </div>
              <div className="stats-row">
                <span>星力</span>
                <strong>234</strong>
              </div>
            </div>
          </section>

          <section className="equipment-card card-panel">
            <div className="equipment-header">
              <div>
                <p className="eyebrow">裝備</p>
                
              </div>
          
            </div>

            <div className="equipment-grid">
              {characterData.equipment.item_equipment.map((item, index) => (
                <div key={index} className="equipment-slot">
                  {item.item_icon ? (
                    <img
                      src={item.item_icon}
                      alt={item.item_name}
                      title={item.item_name}
                      className="equipment-icon"
                    />
                  ) : (
                    <div className="equipment-icon-placeholder" title={item.item_name || "空槽"}>
                      -
                    </div>
                  )}
                  <span className="equipment-name">{item.item_name || item.item_part || "未知"}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
