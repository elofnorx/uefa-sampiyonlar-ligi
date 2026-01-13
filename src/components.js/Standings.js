import React, { useState, useEffect } from 'react';

const Standings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const veriCek = async () => {
    setLoading(true);
    
    try {
      const apiKey = '7bb5503ee95b4d83b2f83b60655707fd'; 
      
      const response = await fetch('https://api.football-data.org/v4/competitions/CL/standings', {
        headers: {
          'X-Auth-Token': apiKey
        }
      });

      if (!response.ok) {
        throw new Error("Veri çekilemedi! Hata oluştu.");
      }

      const data = await response.json();
      
      console.log("Gelen Veri:", data);

      setStandings(data.standings);
      setError(null);

    } catch (hata) {
      console.log("Hata çıktı:", hata);
      setError("Veriler yüklenirken bir sorun oluştu. CORS eklentisi açık mı?");
    }
    
    setLoading(false);
  };

  useEffect(() => {
    veriCek();
  }, []);

  const gosterilecekGruplar = standings.map(grup => {
    
    const filtrelenmisTablo = grup.table.filter(satir => {
      return satir.team.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return { ...grup, table: filtrelenmisTablo };

  }).filter(grup => {
    return grup.table.length > 0;
  });


  return (
    <div>
      <input 
        type="text" 
        placeholder="Takım Ara (Örn: Real Madrid)..." 
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading === true && <div className="loading">Veriler yükleniyor, lütfen bekleyin...</div>}
      
      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      <div className="groups-grid">
        {gosterilecekGruplar.map((grup) => (
          <div key={grup.group} className="group-card">
            <h3>{grup.group.replace('_', ' ')}</h3>
            
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Takım</th>
                  <th>P</th>
                  <th>AV</th>
                </tr>
              </thead>
              <tbody>
                {grup.table.map((satir) => (
                  <tr key={satir.team.id}>
                    <td className={satir.position <= 2 ? 'qualified' : ''}>
                      {satir.position}
                    </td>
                    
                    <td className="team-cell">
                      <img src={satir.team.crest} alt="logo" />
                      {satir.team.name}
                    </td>
                    
                    <td className="points">{satir.points}</td>
                    <td>{satir.goalDifference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      
      {searchTerm !== '' && gosterilecekGruplar.length === 0 && (
         <p style={{textAlign:'center', color:'#ccc'}}>Aradığınız takım bulunamadı.</p>
      )}

    </div>
  );
};

export default Standings;