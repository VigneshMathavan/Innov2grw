import { useState, useRef, useEffect } from 'react';
import { 
  Code, Megaphone, Share2, MapPin, Cpu, Sparkles, 
  Terminal, ArrowRight, Play, DollarSign, Image as ImageIcon,
  MessageSquare, ThumbsUp, Star, GitBranch, GitCommit, RefreshCw
} from 'lucide-react';
import Typewriter from './Typewriter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { API_URL } from '../config';

export default function DemoDashboard({ data, businessName, businessType, goal }) {
  if (!data) return null;

  const { software, marketing, social, seo, automation } = data;

  const getDefaultTab = () => {
    if (goal === 'Lead Generation') return 'marketing';
    if (goal === 'Customer Retention') return 'seo';
    if (goal === 'Sales Automation') return 'automation';
    return 'software';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [budget, setBudget] = useState(1000);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);

  const [ideFiles, setIdeFiles] = useState(data?.software?.files || []);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codePrompt, setCodePrompt] = useState('');

  useEffect(() => {
    if (data?.software?.files) setIdeFiles(data.software.files);
  }, [data]);

  const [isRewritingLP, setIsRewritingLP] = useState(false);
  const [isRewritingCRM, setIsRewritingCRM] = useState(false);

  const generateWebsite = async (e) => {
    e.preventDefault();
    if (!codePrompt.trim() || isGeneratingCode) return;
    
    setIsGeneratingCode(true);
    try {
      const res = await fetch(`${API_URL}/api/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: codePrompt })
      });
      const data = await res.json();
      setIdeFiles(data.files);
      setSelectedFileIndex(-1); // Switch to preview to show the new site
      setCodePrompt('');
    } catch (error) {
      console.error("Failed to generate code:", error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Live Chat State
  const [chatMessages, setChatMessages] = useState(data.chatbot || []);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Automation Execution State
  const [workflowInput, setWorkflowInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [executionLogs, setExecutionLogs] = useState({});

  // Social Media State
  const [socialPosts, setSocialPosts] = useState(() => 
    data?.social?.posts?.map((p, i) => ({ ...p, id: 'post_' + i })) || []
  );
  
  useEffect(() => {
    if (data?.social?.posts && socialPosts.length === 0) {
      setSocialPosts(data.social.posts.map((p, i) => ({ ...p, id: 'post_' + i })));
    }
  }, [data]);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('postId', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('postId');
    setSocialPosts(posts => 
      posts.map(post => post.id === postId ? { ...post, status: newStatus } : post)
    );
  };

  const addPost = () => {
    setSocialPosts([
      ...socialPosts, 
      { id: 'post_' + Date.now(), day: 'Any', theme: 'Custom Idea', caption: 'Write your caption here...', status: 'To Do' }
    ]);
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditingContent(post.caption);
  };

  const [isEnhancing, setIsEnhancing] = useState(false);

  const saveEditing = (id) => {
    setSocialPosts(posts => 
      posts.map(post => post.id === id ? { ...post, caption: editingContent } : post)
    );
    setEditingPostId(null);
  };

  const handleEnhancePost = async (id) => {
    if (!editingContent.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch(`${API_URL}/api/enhance-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: editingContent })
      });
      const data = await res.json();
      setEditingContent(data.enhancedText);
    } catch (error) {
      console.error("Enhancement failed:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const runWorkflow = async (e) => {
    e.preventDefault();
    if (!workflowInput.trim() || isExecuting) return;
    
    setIsExecuting(true);
    setExecutionLogs({});
    
    let currentPayload = { triggerInput: workflowInput };

    for (let i = 0; i < automation.nodes.length; i++) {
      const node = automation.nodes[i];
      setActiveNodeId(node.id);
      
      if (node.type === 'Trigger') {
        // Just log the trigger payload
        setExecutionLogs(prev => ({ ...prev, [node.id]: currentPayload }));
        await new Promise(r => setTimeout(r, 1000)); // fake delay
      } else {
        // It's an Action node, actually execute it with AI
        try {
          const res = await fetch(`${API_URL}/api/execute-node`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nodeLabel: node.label, payload: currentPayload })
          });
          const result = await res.json();
          currentPayload = result.result; // pass output to next node's input
          setExecutionLogs(prev => ({ ...prev, [node.id]: currentPayload }));
        } catch (error) {
          console.error("Workflow error:", error);
          setExecutionLogs(prev => ({ ...prev, [node.id]: { error: "Failed to connect to AI" } }));
          break; // Stop workflow on error
        }
      }
    }
    
    setActiveNodeId(null);
    setIsExecuting(false);
  };

  const AIBadge = () => (
    <span style={{ 
      display: 'inline-flex', alignItems: 'center', gap: '4px', 
      background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', 
      padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', 
      fontWeight: '600', border: '1px solid rgba(99, 102, 241, 0.3)'
    }}>
      <Sparkles size={10} /> AI Generated
    </span>
  );

  const tabs = [
    { id: 'software', label: 'Software Dev', icon: <Code size={18} /> },
    { id: 'marketing', label: 'Digital Marketing', icon: <Megaphone size={18} /> },
    { id: 'social', label: 'Social Media', icon: <Share2 size={18} /> },
    { id: 'seo', label: 'Local SEO', icon: <MapPin size={18} /> },
    { id: 'automation', label: 'AI Automation', icon: <Cpu size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '8px', cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              border: activeTab === tab.id ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
              color: 'white', fontWeight: '500', transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="glass-panel animate-fade-in" style={{ padding: '32px', minHeight: '500px' }}>
        
        {/* SOFTWARE DEV MODULE */}
        {activeTab === 'software' && software && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code color="var(--accent-primary)" /> AI Architecture Sandbox
              </h2>
              <AIBadge />
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>AI Developer Prompt</h3>
              <form onSubmit={generateWebsite} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. 'Build me a dark-themed ecommerce pricing page with a hero section'"
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  disabled={isGeneratingCode}
                  style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', padding: '16px', color: 'white', borderRadius: '8px', outline: 'none' }}
                />
                <button type="submit" disabled={!codePrompt.trim() || isGeneratingCode} className="btn-primary" style={{ padding: '0 32px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isGeneratingCode ? <RefreshCw size={16} className="animate-spin" /> : <Code size={16} />}
                  {isGeneratingCode ? 'Writing Code...' : 'Generate Website'}
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', background: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', minHeight: '500px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}>
              {/* Sidebar */}
              <div style={{ width: '220px', background: '#252526', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', fontSize: '0.75rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>EXPLORER</div>
                {ideFiles?.map((file, idx) => (
                  <div key={idx} onClick={() => setSelectedFileIndex(idx)} style={{ padding: '8px 16px', cursor: 'pointer', background: selectedFileIndex === idx ? '#37373d' : 'transparent', color: selectedFileIndex === idx ? '#fff' : '#ccc', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <Code size={14} color={file.name.includes('.html') ? '#e34c26' : file.name.includes('.css') ? '#264de4' : '#f0db4f'} /> {file.name}
                  </div>
                ))}
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ padding: '16px', fontSize: '0.75rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', borderTop: '1px solid #333' }}>DEPLOYMENT</div>
                  
                  <div onClick={() => setSelectedFileIndex(-1)} style={{ padding: '12px 16px', cursor: 'pointer', background: selectedFileIndex === -1 ? 'rgba(34, 197, 94, 0.2)' : 'transparent', color: selectedFileIndex === -1 ? 'var(--success)' : '#ccc', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: selectedFileIndex === -1 ? 'bold' : 'normal', borderTop: '1px solid #333' }}>
                    <Play size={14} color={selectedFileIndex === -1 ? 'var(--success)' : '#ccc'} /> Live Website Preview
                  </div>
                  <div onClick={() => setIsDeploying(true)} style={{ padding: '12px 16px', cursor: 'pointer', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold', borderTop: '1px solid #333' }}>
                    <Terminal size={14} color="white" /> Simulate Deployment
                  </div>
                </div>
              </div>

              {/* Editor Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                <div style={{ background: '#1e1e1e', padding: '12px 16px', display: 'flex', gap: '8px', borderBottom: '1px solid #333', alignItems: 'center' }}>
                  <Terminal size={14} color="#8b949e" /> <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>{selectedFileIndex === -1 ? 'Browser Preview - localhost:3000' : ideFiles?.[selectedFileIndex]?.name}</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                  </span>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', background: selectedFileIndex === -1 ? 'white' : '#1e1e1e' }}>
                  {selectedFileIndex === -1 ? (
                    <iframe 
                      title="Live Preview"
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                              ${ideFiles?.find(f => f.name.includes('.css'))?.content || ''}
                            </style>
                          </head>
                          <body>
                            ${ideFiles?.find(f => f.name.includes('.html'))?.content || '<h1>No HTML File Found</h1>'}
                            <script>
                              ${ideFiles?.find(f => f.name.includes('.js') || f.name.includes('app'))?.content || ''}
                            </script>
                          </body>
                        </html>
                      `}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  ) : (
                    ideFiles && ideFiles[selectedFileIndex] && (
                      <SyntaxHighlighter 
                        language={ideFiles[selectedFileIndex].language || 'javascript'} 
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, background: 'transparent', padding: '24px', fontSize: '0.9rem', lineHeight: '1.5' }}
                      >
                        {ideFiles[selectedFileIndex].content}
                      </SyntaxHighlighter>
                    )
                  )}
                </div>

                {/* Mock Terminal Panel */}
                {isDeploying && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '200px', background: '#181818', borderTop: '1px solid #333', zIndex: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <div style={{ display: 'flex', padding: '8px 16px', background: '#222', borderBottom: '1px solid #333', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.75rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>TERMINAL</div>
                      <div onClick={() => {
                          setIsDeploying(false);
                          setSelectedFileIndex(-1);
                        }} 
                        style={{ cursor: 'pointer', fontSize: '0.75rem', color: 'var(--success)' }}>
                        [ Close & View Site ]
                      </div>
                    </div>
                    <div style={{ padding: '16px', overflowY: 'auto', flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', color: '#a5d6ff', lineHeight: '1.6' }}>
                      <Typewriter 
                        text={`$ npm run build\n> building production bundle...\n✔ Compiled successfully.\n\n$ aws s3 sync build/ s3://${(businessName || 'demo').toLowerCase().replace(/\s+/g, '')}-site\nupload: build/index.html to s3://${(businessName || 'demo').toLowerCase().replace(/\s+/g, '')}-site/index.html\nupload: build/styles.css to s3://${(businessName || 'demo').toLowerCase().replace(/\s+/g, '')}-site/styles.css\nupload: build/app.js to s3://${(businessName || 'demo').toLowerCase().replace(/\s+/g, '')}-site/app.js\n\n✔ Deployment successful!\nLive URL: https://${(businessName || 'demo').toLowerCase().replace(/\s+/g, '')}.innov2grow.com\nLaunching preview...`} 
                        delay={10} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={16} /> Simulate Deployment Pipeline
              </button>
            </div>
          </div>
        )}

        {/* DIGITAL MARKETING MODULE */}
        {activeTab === 'marketing' && marketing && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone color="var(--accent-primary)" /> AI Ad Sandbox & ROI Engine
              </h2>
              <AIBadge />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Ad Preview */}
              <div style={{ background: 'white', color: 'black', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eee' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{businessName || businessType}</div>
                    <div style={{ color: '#666', fontSize: '0.75rem' }}>Sponsored</div>
                  </div>
                </div>
                <div style={{ padding: '16px', fontSize: '0.9rem' }}>
                  <Typewriter text={marketing.adCopy} delay={15} />
                </div>
                <div style={{ height: '200px', background: '#f0f2f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666', padding: '24px', textAlign: 'center' }}>
                  <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                  <div style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>AI Image Prompt Generated:</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '8px' }}>"{marketing.imagePrompt}"</div>
                </div>
                <div style={{ padding: '16px', background: '#f0f2f5', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}>{marketing.adHeadline}</div>
                  <button style={{ background: '#ddd', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Learn More</button>
                </div>
              </div>

              {/* ROI Calculator */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Interactive ROI Calculator</h3>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Monthly Ad Budget</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>${budget}</span>
                  </div>
                  <input 
                    type="range" min="100" max="10000" step="100" value={budget} 
                    onChange={(e) => setBudget(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>AI Projected Target Audience</div>
                    <div style={{ fontWeight: 'bold', marginTop: '4px' }}>{marketing.targetAudience}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Estimated Clicks</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{Math.floor(budget * 0.42)}</div>
                    </div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Projected Revenue ({marketing.roasMultiplier}x ROAS)</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>${Math.floor(budget * marketing.roasMultiplier)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOCIAL MEDIA MODULE */}
        {activeTab === 'social' && social && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 color="var(--accent-primary)" /> AI Viral Content Analyzer
              </h2>
              <AIBadge />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {['To Do', 'In Review', 'Scheduled'].map(statusColumn => (
                <div 
                  key={statusColumn} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, statusColumn)}
                  style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px' }}
                >
                  <h3 style={{ fontSize: '1rem', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>{statusColumn}</h3>
                  {socialPosts.filter(p => p.status === statusColumn).map(post => (
                    <div 
                      key={post.id} 
                      draggable={editingPostId !== post.id}
                      onDragStart={(e) => handleDragStart(e, post.id)}
                      style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: editingPostId === post.id ? 'default' : 'grab' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{post.day}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.theme}</span>
                      </div>
                      
                      {editingPostId === post.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <textarea 
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', padding: '8px', borderRadius: '4px', minHeight: '60px', fontSize: '0.85rem' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button onClick={() => handleEnhancePost(post.id)} disabled={isEnhancing} style={{ background: 'var(--accent-secondary, #8b5cf6)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: isEnhancing ? 'not-allowed' : 'pointer', opacity: isEnhancing ? 0.7 : 1 }}>
                              {isEnhancing ? '✨ Enhancing...' : '✨ Enhance with AI'}
                            </button>
                            <button onClick={() => saveEditing(post.id)} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <p style={{ fontSize: '0.85rem', lineHeight: '1.4', flex: 1 }}>{post.caption}</p>
                          <button onClick={() => startEditing(post)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.75rem' }}>
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {socialPosts.filter(p => p.status === statusColumn).length === 0 && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>Drag posts here</div>
                  )}
                  {statusColumn === 'To Do' && (
                    <button 
                      onClick={addPost} 
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--text-muted)', color: 'var(--text-main)', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold' }}
                    >
                      + New Idea
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOCAL SEO MODULE */}
        {activeTab === 'seo' && seo && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin color="var(--accent-primary)" /> Local SEO & Auto-Responder
              </h2>
              <AIBadge />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {seo.reviews.map((review, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{review.author[0]}</div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{review.author}</div>
                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? '#fbbf24' : 'none'} />)}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.95rem' }}>"{review.text}"</p>
                  </div>

                  <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                        Sentiment: <strong style={{ color: review.sentiment === 'Positive' ? 'var(--success)' : 'var(--warning)' }}>{review.sentiment}</strong>
                      </span>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                        Keywords: {review.keywords.join(', ')}
                      </span>
                    </div>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--accent-primary)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--bg-dark)', padding: '0 8px', fontSize: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={12} /> Auto-Generated Response</div>
                      <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}><Typewriter text={review.aiResponse} delay={15} /></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI AUTOMATION MODULE */}
        {activeTab === 'automation' && automation && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu color="var(--accent-primary)" /> Visual Workflow Node Builder
              </h2>
              <AIBadge />
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '40px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <div style={{ marginBottom: '32px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                AI Generated Scenario: "{automation.scenario}"
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative' }}>
                {/* Continuous Vertical Connecting Line */}
                <div style={{ position: 'absolute', top: '40px', bottom: '40px', left: '150px', width: '2px', background: 'var(--glass-border)', zIndex: 0 }}></div>

                {automation.nodes.map((node, idx) => (
                  <div key={node.id} style={{ display: 'grid', gridTemplateColumns: '300px 40px 1fr', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    
                    {/* Node Visual */}
                    <div style={{ 
                      background: node.type === 'Trigger' ? 'rgba(234, 88, 12, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      border: `1px solid ${node.type === 'Trigger' ? 'rgba(234, 88, 12, 0.5)' : 'rgba(99, 102, 241, 0.5)'}`,
                      boxShadow: activeNodeId === node.id ? `0 0 25px ${node.type === 'Trigger' ? 'rgba(234, 88, 12, 0.4)' : 'rgba(99, 102, 241, 0.4)'}` : '0 4px 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      padding: '20px 24px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      width: '300px',
                      backdropFilter: 'blur(10px)'
                    }} className="animate-fade-in">
                      {node.type === 'Trigger' ? <Play size={28} color="#f97316" /> : <GitCommit size={28} color="#6366f1" />}
                      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: node.type === 'Trigger' ? '#f97316' : '#6366f1', fontWeight: 'bold' }}>{node.type}</div>
                      <div style={{ fontWeight: '600', textAlign: 'center', lineHeight: '1.4', fontSize: '0.95rem' }}>{node.label}</div>
                    </div>

                    {/* Connecting Arrow to Output */}
                    <div style={{ display: 'flex', justifyContent: 'center', opacity: executionLogs[node.id] || (node.type === 'Trigger' && !isExecuting && !executionLogs[node.id]) ? 1 : 0, transition: 'opacity 0.3s' }}>
                      <ArrowRight size={20} color="var(--glass-border)" />
                    </div>

                    {/* Execution Interaction / Logs */}
                    <div style={{ width: '100%', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {node.type === 'Trigger' && !isExecuting && !executionLogs[node.id] ? (
                        <form onSubmit={runWorkflow} style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                          <input 
                            type="text" 
                            placeholder="Type a trigger (e.g. 'I need SEO help')"
                            value={workflowInput}
                            onChange={(e) => setWorkflowInput(e.target.value)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: 'white', borderRadius: '8px', outline: 'none' }}
                          />
                          <button type="submit" disabled={!workflowInput.trim()} className="btn-primary" style={{ padding: '0 24px', borderRadius: '8px', fontWeight: 'bold' }}>
                            Run
                          </button>
                        </form>
                      ) : null}

                      {activeNodeId === node.id && !executionLogs[node.id] && (
                         <div style={{ color: 'var(--accent-primary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99, 102, 241, 0.1)', padding: '16px 24px', borderRadius: '12px', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
                           <RefreshCw size={18} className="animate-spin" /> <span style={{ fontWeight: '500' }}>AI Executing Action...</span>
                         </div>
                      )}

                      {executionLogs[node.id] && (
                        <div className="animate-fade-in" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
                          <div style={{ background: '#161b22', padding: '10px 16px', fontSize: '0.75rem', color: '#8b949e', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                            <Code size={14} /> Execution Payload
                          </div>
                          <div style={{ padding: '16px', overflowX: 'auto' }}>
                            <pre style={{ margin: 0, color: '#a5d6ff', fontSize: '0.85rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                              <Typewriter text={JSON.stringify(executionLogs[node.id], null, 2)} delay={2} />
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
