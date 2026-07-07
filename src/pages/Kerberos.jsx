import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Kerberos = () => {
  const [activeNode, setActiveNode] = useState('Client');

  const getGlow = (nodeName) => {
    const isSelected = activeNode === nodeName;
    return isSelected ? { filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))', cursor: 'pointer' } : { cursor: 'pointer' };
  };

  const getGlowStyle = (nodeName) => {
    const isSelected = activeNode === nodeName;
    return isSelected ? { stroke: '#10b981', strokeWidth: 3, filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))' } : {};
  };

  const Node = ({ x, y, width = 140, height = 80, title, colorCode, nodeName, icon }) => {
    let fill, stroke;
    if (colorCode === 'client') { fill = "#0C4A6E"; stroke = "#38BDF8"; }
    else if (colorCode === 'as') { fill = "#14532D"; stroke = "#4ADE80"; }
    else if (colorCode === 'tgs') { fill = "#78350F"; stroke = "#FBBF24"; }
    else if (colorCode === 'app') { fill = "#4C1D95"; stroke = "#C084FC"; }
    else if (colorCode === 'db') { fill = "#334155"; stroke = "#94A3B8"; }

    const dynamicStyle = getGlowStyle(nodeName);
    
    return (
      <motion.g 
        transform={`translate(${x}, ${y})`}
        onClick={() => setActiveNode(nodeName)}
        style={getGlow(nodeName)}
      >
        <rect width={width} height={height} rx="8" fill={fill} stroke={dynamicStyle.stroke || stroke} strokeWidth={dynamicStyle.strokeWidth || 2} />
        {icon && (
          <text x={width / 2} y={height / 2 - 10} fill="#fff" fontSize="28" textAnchor="middle">{icon}</text>
        )}
        <text x={width / 2} y={icon ? height / 2 + 20 : height / 2 + 5} fill="#fff" fontSize="15" fontWeight="bold" textAnchor="middle">{title}</text>
      </motion.g>
    );
  };

  const FlowArrow = ({ x1, y1, x2, y2, color, label, step, bendX, bendY, nodeName }) => {
    const isBent = bendX !== undefined && bendY !== undefined;
    const dynamicStyle = getGlowStyle(nodeName);
    const strokeColor = dynamicStyle.stroke || color;
    const strokeW = dynamicStyle.strokeWidth || 2;
    
    return (
      <motion.g
        onClick={() => setActiveNode(nodeName)}
        style={getGlow(nodeName)}
      >
        {isBent ? (
          <path d={`M ${x1} ${y1} Q ${bendX} ${bendY - 30} ${x2} ${y2}`} stroke={strokeColor} strokeWidth={strokeW} fill="none" markerEnd="url(#kerb-arrow)" />
        ) : (
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeW} fill="none" markerEnd="url(#kerb-arrow)" />
        )}
        
        <circle cx={isBent ? bendX : (x1 + x2) / 2} cy={isBent ? bendY - 15 : (y1 + y2) / 2 - 15} r="10" fill={strokeColor} />
        <text x={isBent ? bendX : (x1 + x2) / 2} y={isBent ? bendY - 11 : (y1 + y2) / 2 - 11} fill="#050B14" fontSize="12" fontWeight="bold" textAnchor="middle">{step}</text>
        <text x={isBent ? bendX : (x1 + x2) / 2} y={isBent ? bendY + 15 : (y1 + y2) / 2 + 15} fill={strokeColor} fontSize="14" fontWeight="bold" textAnchor="middle">{label}</text>
      </motion.g>
    );
  };

  return (
    <section className="view-section active">
      <div className="view-header" style={{ marginBottom: '20px' }}>
        <h2>Kerberos Authentication</h2>
        <p>
          Kerberos is a secure, ticketing-based network authentication protocol designed to provide strong authentication 
          for client/server applications by using secret-key cryptography. It ensures nodes communicating over a 
          non-secure network can prove their identity to one another in a secure manner.
        </p>
      </div>

      <div className="flowchart-scale-wrapper" style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', width: '100%', margin: '0 auto', padding: '0 20px', marginTop: '20px' }}>
          
          <div style={{ width: '800px', height: '466px', flexShrink: 0 }}>
            <div style={{ width: '1200px', height: '700px', position: 'relative', background: '#050B14', transform: 'scale(0.666)', transformOrigin: 'top left', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              
              <svg width="1200" height="700" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <marker id="kerb-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#94A3B8" />
                  </marker>
                </defs>

                {/* KDC Bounding Box */}
                <g transform="translate(610, 40)">
                  <rect width={510} height={390} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" rx="16" />
                  <text x="20" y="30" fill="#64748B" fontSize="20" fontWeight="bold">Key Distribution Center (KDC)</text>
                </g>

                {/* Nodes */}
                <Node x={50} y={80} width={200} height={560} title="Client" colorCode="client" nodeName="Client" icon="💻" />
                
                <Node x={650} y={90} width={230} height={110} title="Authentication Server" colorCode="as" nodeName="Authentication Server (AS)" icon="🔐" />
                <Node x={650} y={280} width={230} height={110} title="Ticket Granting Server" colorCode="tgs" nodeName="Ticket Granting Server (TGS)" icon="🎫" />
                
                <Node x={650} y={530} width={230} height={110} title="Application Server" colorCode="app" nodeName="Application Server" icon="🖥️" />
                
                <Node x={930} y={200} width={150} height={130} title="Database" colorCode="db" nodeName="Database" icon="🗄️" />

                {/* Internal KDC Links */}
                <path d="M 880 145 L 930 225" stroke="#64748B" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                <path d="M 880 335 L 930 285" stroke="#64748B" strokeWidth="2" fill="none" strokeDasharray="4,4" />

                {/* Authentication Flow Arrows */}
                <FlowArrow x1={250} y1={120} x2={650} y2={120} color="#94A3B8" label="User requesting authentication" step="1" nodeName="Step 1: Authentication Request" />
                
                <FlowArrow x1={650} y1={170} x2={250} y2={170} bendX={450} bendY={180} color="#38BDF8" label="AS verifies credentials & issues TGT" step="2" nodeName="Step 2: Authentication Response" />
                
                <FlowArrow x1={250} y1={310} x2={650} y2={310} color="#94A3B8" label="Client requests service ticket" step="3" nodeName="Step 3: TGS Request" />
                
                <FlowArrow x1={650} y1={360} x2={250} y2={360} bendX={450} bendY={370} color="#4ADE80" label="TGS issues the service ticket" step="4" nodeName="Step 4: TGS Response" />

                <FlowArrow x1={250} y1={560} x2={650} y2={560} color="#94A3B8" label="Client accesses Application Server via Service Ticket" step="5" nodeName="Step 5: App Server Request" />
                
                <FlowArrow x1={650} y1={610} x2={250} y2={610} color="#A855F7" label="Application Server confirms the session" step="6" nodeName="Step 6: App Server Response" />

              </svg>
            </div>
          </div>

          <div style={{ flex: '0 0 360px', position: 'sticky', top: '20px' }}>
            <div style={{ width: '100%', background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 5px 20px rgba(0,0,0,0.15)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>Click any component or flow step in the diagram to learn about its exact role.</p>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '12px', marginTop: 0, fontSize: '1.2rem' }}>{activeNode}</h3>
              
              {activeNode === 'Client' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The user or application attempting to access a secure service.<br/><br/><strong>Why it matters:</strong> The client initiates the authentication process. Kerberos is designed so that the client never transmits their actual password over the network; instead, they prove they know the password using cryptographic keys.</p>}
              {activeNode === 'Authentication Server (AS)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The first point of contact in the Key Distribution Center (KDC).<br/><br/><strong>Why it matters:</strong> It acts as the bouncer. It verifies the client's identity by checking their credentials against the Database, and if valid, issues a Ticket Granting Ticket (TGT). This allows the client to request access to specific services later without re-authenticating.</p>}
              {activeNode === 'Ticket Granting Server (TGS)' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The second component of the KDC.<br/><br/><strong>Why it matters:</strong> It issues Service Tickets. Once a client has a valid TGT, they present it to the TGS to request access to specific applications (like a file server or email server). The TGS verifies the TGT and issues the service-specific ticket.</p>}
              {activeNode === 'Application Server' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The target service the client ultimately wants to use.<br/><br/><strong>Why it matters:</strong> It doesn't communicate with the KDC directly during the authentication phase. Instead, it fully trusts the Service Ticket presented by the client, which was securely generated and encrypted by the TGS.</p>}
              {activeNode === 'Database' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The secure backend storage for the KDC.<br/><br/><strong>Why it matters:</strong> It holds the master keys (passwords) for all users and all application servers in the realm. The AS queries this database to verify user credentials.</p>}
              
              {activeNode === 'Step 1: Authentication Request' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The client sends their principal ID (username) to the Authentication Server in plaintext to request a Ticket Granting Ticket (TGT).<br/><br/><strong>Why it matters:</strong> No secret information (like passwords) is transmitted in this step. The AS just needs to know who is requesting access to begin the process.</p>}
              {activeNode === 'Step 2: Authentication Response' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The AS looks up the user, generates a session key, and creates a TGT. It encrypts this payload using the user's secret key (derived from their password) and sends it back.<br/><br/><strong>Why it matters:</strong> The client can only decrypt this response if they know their actual password. If successful, they extract the TGT and the session key, proving their identity without ever sending their password over the network.</p>}
              {activeNode === 'Step 3: TGS Request' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The client wants to access a specific Application Server. They send the TGT (which they can't read, as it's encrypted with the TGS's secret key) along with an Authenticator (encrypted with the session key) to the Ticket Granting Server.<br/><br/><strong>Why it matters:</strong> This proves to the TGS that the client was legitimately authenticated by the AS recently.</p>}
              {activeNode === 'Step 4: TGS Response' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The TGS decrypts the TGT, verifies the Authenticator, and generates a new Service Ticket specifically for the target Application Server. It encrypts this ticket and sends it back to the client.<br/><br/><strong>Why it matters:</strong> The client now holds a valid "boarding pass" specifically authorized for the target application.</p>}
              {activeNode === 'Step 5: App Server Request' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> The client sends the Service Ticket and a new Authenticator to the Application Server.<br/><br/><strong>Why it matters:</strong> The Application Server decrypts the Service Ticket using its own secret key (which it shares with the KDC). This securely informs the Application Server of the client's identity and provides a session key for secure communication.</p>}
              {activeNode === 'Step 6: App Server Response' && <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}><strong>What it is:</strong> (Optional but common) Mutual authentication. The Application Server encrypts a timestamp from the client's Authenticator and sends it back.<br/><br/><strong>Why it matters:</strong> This proves to the client that the Application Server is genuine and not an imposter, as only the true server could decrypt the Service Ticket to retrieve the session key needed to encrypt the response.</p>}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Kerberos;
