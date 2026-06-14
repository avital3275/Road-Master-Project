import { useState }    from 'react';
import StudentSidebar  from '../../components/StudentSidebar';
import '../../styles/Dashboard.css';

const YOUTUBE_VIDEOS = [
    { id: '04ZK65U6XAI', title: 'חינוך תעבורתי — מבוא' },
    { id: '8KcbyxzmUIc', title: 'היבטים של תקשורת בדרך וסימנים מעידים' },
    { id: 'DuCXWGm2uNY', title: 'אחריות משתמשים בדרך והחוק במרחב התעבורתי' },
    { id: 'bL_ThX1f3J0', title: 'עקרונות הנהיגה הביטחונית' },
    { id: 'eYx7yGJk4IA', title: 'הדרך והסביבה' },
    { id: '6LGQ7fAsgsQ', title: 'הנוסעים ברכב ולחץ חברתי' },
    { id: 'bj8nZaluWFw', title: 'רכב דו גלגלי — אופנוע' },
    { id: 'ldir_Z-3r0k', title: 'רכב דו גלגלי — אופניים חשמליות' },
    { id: 'CWOLmwx0B3Q', title: 'מהירות ונטילת סיכונים' },
    { id: '0_8iPDmuJ4o', title: 'זמן תגובה ומרחק עצירה' },
    { id: '1CBJFFifFV4', title: 'היסח הדעת בנהיגה' },
    { id: 'HQn8bSDBXdo', title: 'תפיסת סיכונים וזיהוי מוקדם של סכנות בדרך' },
    { id: '58TjjDuVU38', title: 'אלכוהול ונהיגה' },
    { id: 'bgjD4mjsN6Q', title: 'נהיגה בסביבה עירונית' },
    { id: 'Rp4wFyF-dok', title: 'הצומת' },
    { id: 'Sp_qDMZIbAQ', title: 'נסיעה בסביבה שאינה עירונית' },
    { id: '3-emqlNNet8', title: 'נהיגה בתנאים מכבידים' },
    { id: 'AJTPXQXTJEw', title: 'הפעלת כלי רכב בבטחה' },
    { id: 'ccIBymhl2Qk', title: 'נהיגת לילה ועייפות בנהיגה' },
    { id: 'hG0LnDIfivw', title: 'תאונת דרכים וכמעט תאונה' },
    { id: 'mdbQjXodORM', title: 'לקראת רישיון נהיגה — קבלת רישיון ונהיגה בליווי' },
];

const TIPS = [
    { title: 'זכות קדימה',   text: 'בצומת ללא תמרורים — תן זכות קדימה לרכב הבא מימינך.' },
    { title: 'מרחק בלימה',   text: 'שמור מרחק של לפחות 2 שניות מהרכב שלפניך בנסיעה בעיר.' },
    { title: 'קו לבן רצוף',  text: 'קו לבן רצוף אסור לחציה בשום מצב — אפילו לא לחלקית.' },
    { title: 'רמזור צהוב',   text: 'אור צהוב קבוע — האט ועצור אם ניתן לעשות זאת בבטחה.' },
    { title: 'מהירות בעיר',  text: 'המהירות המותרת בעיר היא 50 קמ"ש אלא אם צוין אחרת.' },
    { title: 'חגורת בטיחות', text: 'חובת חגורה חלה על כל הנוסעים ברכב — מנהג ועד אחורי.' },
];

const COMMON_MISTAKES = [
    'אי מתן זכות קדימה בצמתים עם תמרור "תן זכות קדימה"',
    'נסיעה מהר מדי בגשם — הכביש רטוב ומרחק הבלימה גדל משמעותית',
    'אי הפעלת אור מהבהב לפני פנייה — יש להפעיל לפחות 30 מטר מראש',
    'חציית קו לבן רצוף בעת עקיפה — אסור בהחלט',
    'עצירה לא מלאה בתמרור "עצור" — חייבים לעצור לחלוטין לפני הקו',
    'שכחת ראי בעת שינוי נתיב — חובה לבדוק ראי ועיוורת עין',
];

const TABS = [
    { key: 'videos',   label: 'סרטוני הסבר' },
    { key: 'tips',     label: 'טיפים למבחן' },
    { key: 'mistakes', label: 'טעויות נפוצות' },
];

const Theory = () => {
    const [activeTab, setActiveTab] = useState('videos');

    return (
        <div className="page-container">
            <StudentSidebar />

            <div className="theory-page">

                <div className="theory-hero">
                    <h1>למידת תיאוריה</h1>
                    <p>כל מה שצריך לדעת לפני המבחן</p>
                </div>

                <div className="theory-tabs-bar">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            className={`theory-tab-btn ${activeTab === t.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="theory-content">

                    {activeTab === 'videos' && (
                        <>
                            <div className="theory-section-header">
                                <h2>סרטוני הסבר</h2>
                                <p>{YOUTUBE_VIDEOS.length} סרטונים בנושאי תיאוריה</p>
                            </div>
                            <div className="theory-videos-grid">
                                {YOUTUBE_VIDEOS.map((video, i) => (
                                    <div key={i} className="theory-video-card">
                                        <div className="theory-video-embed">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${video.id}`}
                                                title={video.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                        <p className="theory-video-title">{video.title}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'tips' && (
                        <>
                            <div className="theory-section-header">
                                <h2>טיפים למבחן תיאוריה</h2>
                                <p>{TIPS.length} טיפים שיעזרו לך לעבור בהצלחה</p>
                            </div>
                            <div className="theory-tips-grid">
                                {TIPS.map((tip, i) => (
                                    <div key={i} className="theory-tip-card">
                                        <div className="theory-tip-header">
                                            <div className="theory-tip-num">{i + 1}</div>
                                            <h3 className="theory-tip-title">{tip.title}</h3>
                                        </div>
                                        <p className="theory-tip-text">{tip.text}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'mistakes' && (
                        <>
                            <div className="theory-section-header">
                                <h2>טעויות נפוצות של תלמידים</h2>
                                <p>הימנעות מטעויות אלו תשפר את הסיכויים שלך לעבור</p>
                            </div>
                            <div className="theory-mistakes-list">
                                {COMMON_MISTAKES.map((mistake, i) => (
                                    <div key={i} className="theory-mistake-card">
                                        <div className="theory-mistake-num">{i + 1}</div>
                                        <p className="theory-mistake-text">{mistake}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Theory;