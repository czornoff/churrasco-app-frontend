// src/components/Styles.js
export const commonStyles = {
    container: { 
        maxWidth: '1200px', 
        margin: '40px auto', 
        padding: '0 20px', 
        fontFamily: "'Segoe UI', Roboto, sans-serif" 
    },
    column: {
        flex: '1',
        minWidth: '250px'
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

export const footerStyles = {
    footer: {
        backgroundColor: '#1a1a1a',
        color: '#ccc',
        padding: '40px 0 0 0',
        marginTop: '60px',
        borderTop: '3px solid #ff5252',
        fontFamily: "'Segoe UI', Roboto, sans-serif"
    },
    
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: '30px'
    },
    column: {
        flex: '1',
        minWidth: '250px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
    },
    logoImg: { height: '35px', width: 'auto' },
    logoText: { color: '#ff5252', fontSize: '20px', fontWeight: 'bold' },
    description: { fontSize: '14px', lineHeight: '1.6' },
    heading: { color: '#fff', fontSize: '16px', marginBottom: '15px', textTransform: 'uppercase' },
    nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
    link: { color: '#aaa', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' },
    socialRow: { marginTop: '10px' },
    socialIcon: { color: '#ff5252', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' },
    bottomBar: {
        borderTop: '1px solid #333',
        marginTop: '40px',
        padding: '20px',
        textAlign: 'center'
    },
    copyright: { fontSize: '12px', color: '#666', margin: 0 }
};

export const loginStyles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f5f5f5' },
    card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '380px', width: '90%' },
    titulo: { color: '#333', marginBottom: '20px', fontSize: '24px' },
    googleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', backgroundColor: '#fff', border: '1px solid #dadce0', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', color: '#3c4043', marginBottom: '15px' },
    divisor: { borderBottom: '1px solid #eee', lineHeight: '0.1em', margin: '20px 0' },
    divisorTexto: { background: '#fff', padding: '0 10px', color: '#999', fontSize: '13px' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' },
    submitBtn: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#e53935', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' },
    alerta: { padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' },
    footer: { marginTop: '20px', fontSize: '14px' },
    toggleText: { color: '#666', marginBottom: '15px' },
    toggleLink: { color: '#e53935', fontWeight: 'bold', cursor: 'pointer' },
    backLink: { color: '#999', textDecoration: 'none', display: 'block', marginTop: '10px' }
};

export const headerStyles = {
    header: {
        backgroundColor: '#1a1a1a',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        height: '70px'
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '30px'
    },
    logoLink: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    logoImg: {
        height: '100px',  // Ajuste a altura conforme necessário
        width: 'auto',   // Mantém a proporção
        display: 'block',
        marginTop: '30px' // Ajuste vertical para alinhar com o texto
    },
    logoText: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#ff5252',
    },
    mainNav: {
        display: 'flex',
        gap: '20px'
    },
    navLink: {
        color: '#efefef',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    userSection: {
        display: 'flex',
        flexDirection: 'row', // Garante alinhamento horizontal
        alignItems: 'center',
        gap: '15px'
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    avatar: {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: '2px solid #ff5252',
        objectFit: 'cover'
    },
    userName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#fff'
    },
    adminLink: {
        color: '#ffc107',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        border: '1px solid #ffc107',
        padding: '5px 10px',
        borderRadius: '4px'
    },
    logoutBtn: {
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #444',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
    },
    hamburger: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '28px',
        cursor: 'pointer'
    },
    mobileMenu: {
        position: 'absolute',
        top: '70px',
        left: 0,
        width: '100%',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '15px',
        borderTop: '1px solid #333'
    },
    mobileNavLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    divider: { width: '100%', borderColor: '#333', margin: '5px 0' },
    mobileLogoutBtn: {
        backgroundColor: '#ff5252',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    loginBtn: {
        backgroundColor: '#ff5252',
        color: 'white',
        textDecoration: 'none',
        padding: '8px 20px',
        borderRadius: '4px',
        fontWeight: 'bold'
    },
    dropdownContainer: {
        position: 'relative',
        display: 'inline-block'
    },
    adminDropdownBtn: {
        backgroundColor: '#333',
        color: '#ffc107',
        border: '1px solid #ffc107',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        right: 0,
        backgroundColor: '#222',
        minWidth: '180px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        borderRadius: '4px',
        zIndex: 1100,
        padding: '5px 0',
        border: '1px solid #444',
        marginTop: '5px'
    },
    dropdownItem: {
        color: '#fff',
        padding: '12px 16px',
        textDecoration: 'none',
        display: 'block',
        fontSize: '14px',
        transition: 'background 0.2s',
        textAlign: 'left'
    },
    dropdownDivider: {
        height: '1px',
        backgroundColor: '#444',
        margin: '5px 0'
    },
};