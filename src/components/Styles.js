// src/components/Styles.js
export const commonStyles = {
    container: { 
        maxWidth: '1200px', 
        margin: '40px auto', 
        padding: '0 20px', 
        fontFamily: "'Segoe UI', Roboto, sans-serif" 
    },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontSize: '32px', color: '#333', marginBottom: '10px' },
    subtitle: { fontSize: '18px', color: '#666' },
    grid: { 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '20px' 
    },
    card: { 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        padding: '25px', 
        width: '280px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
        borderTop: '5px solid #ff5252',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        transition: 'transform 0.2s'
    },
    cardTitle: { margin: 0, color: '#1a1a1a', fontSize: '18px' },
    cardText: { margin: 0, color: '#444', lineHeight: '1.5', fontSize: '14px' },
    price: { color: '#ff5252', fontWeight: 'bold', fontSize: '20px' },
    viewBtn: { 
        marginTop: '10px', 
        padding: '8px', 
        backgroundColor: '#4caf50', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontWeight: 'bold' 
    }
};

export const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        padding: '20px'
    },
    content: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    closeBtn: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        border: 'none',
        background: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#666'
    },
    sectionTitle: {
        borderBottom: '2px solid #4caf50',
        paddingBottom: '5px',
        marginTop: '20px',
        color: '#333'
    },
    list: {
        paddingLeft: '20px',
        lineHeight: '1.8',
        color: '#444'
    },
    text: {
        lineHeight: '1.6',
        color: '#444'
    }
};