import { useState, useEffect } from 'react';
import useAuth                  from '../../hooks/useAuth';
import StudentSidebar           from '../../components/StudentSidebar';
import Loader                   from '../../components/Loader';
import theoryService            from '../../services/theoryService';
import '../../styles/Dashboard.css';

const Theory = () => {
    const { token } = useAuth();

    const [signs,        setSigns]        = useState([]);
    const [selectedSign, setSelectedSign] = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [searchQuery,  setSearchQuery]  = useState('');
    const [playingId,    setPlayingId]    = useState(null);

    useEffect(() => {
        const fetchSigns = async () => {
            try {
                const data = await theoryService.getSigns(token);
                setSigns(Array.isArray(data) ? data : []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchSigns();
    }, [token]);

    const handlePlay = (sign) => {
        if (playingId === sign.id) {
            window.speechSynthesis.cancel();
            setPlayingId(null);
            return;
        }
        setPlayingId(sign.id);
        const utterance = new SpeechSynthesisUtterance(sign.question_text);
        utterance.lang  = 'he-IL';
        utterance.onend = () => setPlayingId(null);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const filteredSigns = signs.filter(s =>
        s.question_text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-container">
            <StudentSidebar />

            <main className="main-content">
                <div className="page-header">
                    <h1>📚 למידת תיאוריה</h1>
                    <p>צפה בתמרורים והאזן להסברים</p>
                </div>

                <div className="section">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 חפש תמרור..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? <Loader /> : (
                    <div className="signs-grid">
                        {filteredSigns.map(sign => (
                            <div
                                key={sign.id}
                                className={`sign-card ${selectedSign?.id === sign.id ? 'selected' : ''}`}
                                onClick={() => setSelectedSign(sign)}
                            >
                                {sign.image_path && (
                                    <img
                                        src={`http://localhost:5000${sign.image_path}`}
                                        alt={sign.question_text}
                                        className="sign-image"
                                    />
                                )}
                                <div className="sign-info">
                                    <p className="sign-name">{sign.question_text}</p>
                                    <button
                                        className={`audio-btn ${playingId === sign.id ? 'playing' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); handlePlay(sign); }}
                                    >
                                        {playingId === sign.id ? '⏸ עצור' : '🔊 האזן'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedSign && (
                    <div className="section sign-detail">
                        <h2 className="section-title">פרטי תמרור</h2>
                        <div className="sign-detail-content">
                            {selectedSign.image_path && (
                                <img
                                    src={`http://localhost:5000${selectedSign.image_path}`}
                                    alt={selectedSign.question_text}
                                    className="sign-detail-image"
                                />
                            )}
                            <div className="sign-detail-text">
                                <h3>{selectedSign.question_text}</h3>
                                <p>{selectedSign.option_a}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handlePlay(selectedSign)}
                                >
                                    {playingId === selectedSign.id ? '⏸ עצור' : '🔊 האזן להסבר'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Theory;