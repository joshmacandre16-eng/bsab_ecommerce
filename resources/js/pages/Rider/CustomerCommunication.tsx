import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, MessageCircle, Package, Phone, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import RiderLayout from './Layout';

// Configure axios to include CSRF token from cookies
axios.defaults.withCredentials = true;

// Extract CSRF token from cookie
const getCsrfToken = () => {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
};

const token = getCsrfToken();
if (token) {
    axios.defaults.headers.common['X-XSRF-TOKEN'] = token;
}

interface Message {
    id: number;
    sender_id: number;
    message: string;
    created_at: string;
    sender: { id: number; name: string };
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    customer: { id: number; name: string; phone?: string };
    address?: { address_line1: string; city: string };
    messages: Message[];
}

const STATUS_COLOR: Record<string, string> = {
    shipped: '#3b82f6',
    picked_up: '#8b5cf6',
    on_the_way: '#f59e0b',
    delivered: '#22c55e',
    cancelled: '#ef4444',
};

export default function CustomerCommunication({ activeOrders: initialOrders, authId }: { activeOrders: Order[]; authId: number }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedId, setSelectedId] = useState<number | null>(initialOrders[0]?.id ?? null);
    const [showChat, setShowChat] = useState(false);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    const selected = orders.find((o) => o.id === selectedId) ?? null;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selected?.messages.length]);

    function selectOrder(order: Order) {
        setSelectedId(order.id);
        setShowChat(true);
        setError('');
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!selected || !text.trim() || sending) return;
        setSending(true);
        setError('');

        try {
            const { data } = await axios.post<Message>(route('rider.communication.message', selected.id), { message: text.trim() });
            setText('');
            setOrders((prev) => prev.map((o) => (o.id === selected.id ? { ...o, messages: [...o.messages, data] } : o)));
        } catch (err: any) {
            console.error('Message submission error:', err);
            let msg = 'Unknown error';

            if (err?.response?.status) {
                msg = err.response.data?.message || err.response.data?.error || `Error ${err.response.status}`;
            } else if (err?.message) {
                msg = err.message;
            } else if (err?.code) {
                msg = `Error: ${err.code}`;
            }

            setError(msg);
        } finally {
            setSending(false);
        }
    }

    return (
        <RiderLayout title="Customer Communication">
            <Head title="Customer Communication" />

            <style>{`
                .cc-wrap { display: flex; gap: 16px; height: calc(100vh - 160px); min-height: 480px; }
                .cc-list { width: 240px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
                .cc-chat { flex: 1; display: flex; flex-direction: column; border: 1px solid #d4ddd2; background: #fff; border-radius: 10px; overflow: hidden; min-width: 0; }
                .cc-order-btn { text-align: left; padding: 12px 14px; border-radius: 8px; cursor: pointer; transition: all .15s; width: 100%; background: #fff; }
                .cc-order-btn:hover { background: #f4f8f3; }
                .cc-order-btn.active { border: 1.5px solid #2d5a27 !important; background: #f4f8f3; }
                .cc-messages { flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
                .cc-input-row { padding: 12px 16px; border-top: 1px solid #e8f0e6; display: flex; gap: 8px; flex-shrink: 0; background: #fff; flex-direction: column; }
                .cc-input-inner { display: flex; gap: 8px; }
                .cc-input { flex: 1; padding: 9px 13px; border: 1px solid #d4ddd2; border-radius: 8px; font-size: 13px; outline: none; font-family: inherit; min-width: 0; transition: border-color .15s; }
                .cc-input:focus { border-color: #2d5a27; }
                .cc-back-btn { display: none; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-size: 13px; color: #4a6741; padding: 0; font-family: inherit; font-weight: 500; }
                @media (max-width: 640px) {
                    .cc-wrap { height: auto; min-height: unset; gap: 0; flex-direction: column; }
                    .cc-list { width: 100%; }
                    .cc-list.hidden-mobile { display: none; }
                    .cc-chat { display: none; height: calc(100vh - 160px); }
                    .cc-chat.visible-mobile { display: flex; }
                    .cc-back-btn { display: flex; }
                }
            `}</style>

            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1a2e1a' }}>Customer Communication</div>
                <div style={{ fontSize: 13, color: '#6b7e68', marginTop: 2 }}>Chat with customers about their active orders.</div>
            </div>

            {orders.length === 0 ? (
                <div className="ap-panel">
                    <div className="ap-panel-body">
                        <div className="ap-empty">
                            <Package style={{ color: '#d4ddd2', width: 48, height: 48, margin: '0 auto 12px' }} />
                            <p>No active orders to chat about.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="cc-wrap">
                    {/* Order list */}
                    <div className={`cc-list${showChat ? 'hidden-mobile' : ''}`}>
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: '#6b7e68',
                                padding: '0 4px',
                                marginBottom: 4,
                            }}
                        >
                            Active Orders
                        </div>
                        {orders.map((order) => (
                            <button
                                key={order.id}
                                onClick={() => selectOrder(order)}
                                className={`cc-order-btn${selectedId === order.id ? 'active' : ''}`}
                                style={{ border: selectedId === order.id ? '1.5px solid #2d5a27' : '1px solid #d4ddd2' }}
                            >
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2e1a' }}>#{order.order_number}</div>
                                <div style={{ fontSize: 12, color: '#4a6741', marginTop: 2 }}>{order.customer?.name}</div>
                                <div style={{ marginTop: 5 }}>
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 600,
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            padding: '2px 7px',
                                            borderRadius: 20,
                                            background: (STATUS_COLOR[order.status] ?? '#6b7e68') + '20',
                                            color: STATUS_COLOR[order.status] ?? '#6b7e68',
                                        }}
                                    >
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                {order.messages.length > 0 && (
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: '#6b7e68',
                                            marginTop: 4,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {order.messages[order.messages.length - 1].message}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Chat panel */}
                    <div className={`cc-chat${showChat ? 'visible-mobile' : ''}`}>
                        {selected ? (
                            <>
                                {/* Header */}
                                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8f0e6', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                            <button className="cc-back-btn" onClick={() => setShowChat(false)}>
                                                <ArrowLeft style={{ width: 15, height: 15 }} /> Back
                                            </button>
                                            <MessageCircle style={{ width: 15, height: 15, color: '#2d5a27', flexShrink: 0 }} />
                                            <div style={{ minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: 14,
                                                        color: '#1a2e1a',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    #{selected.order_number} — {selected.customer?.name}
                                                </div>
                                                {selected.address && (
                                                    <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 1 }}>
                                                        📍 {selected.address.address_line1}, {selected.address.city}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {selected.customer?.phone && (
                                            <a
                                                href={`tel:${selected.customer.phone}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 5,
                                                    padding: '6px 12px',
                                                    borderRadius: 8,
                                                    border: '1px solid #d4ddd2',
                                                    fontSize: 12,
                                                    color: '#4a6741',
                                                    textDecoration: 'none',
                                                    background: '#f4f8f3',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Phone style={{ width: 13, height: 13 }} /> {selected.customer.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="cc-messages">
                                    {selected.messages.length === 0 && (
                                        <div style={{ textAlign: 'center', color: '#6b7e68', fontSize: 13, marginTop: 40 }}>
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                    {selected.messages.map((msg) => {
                                        const isMe = msg.sender_id === authId;
                                        return (
                                            <div
                                                key={msg.id}
                                                style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}
                                            >
                                                <div style={{ fontSize: 10, color: '#6b7e68', marginBottom: 3, fontFamily: 'var(--mono)' }}>
                                                    {isMe ? 'You' : msg.sender?.name} ·{' '}
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div
                                                    style={{
                                                        maxWidth: '75%',
                                                        padding: '8px 12px',
                                                        borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                                        background: isMe ? '#2d5a27' : '#f4f8f3',
                                                        color: isMe ? '#fff' : '#1a2e1a',
                                                        fontSize: 13,
                                                        lineHeight: 1.5,
                                                        border: isMe ? 'none' : '1px solid #d4ddd2',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {msg.message}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={submit} className="cc-input-row">
                                    {error && (
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: '#a32d2d',
                                                background: '#fdf5f5',
                                                border: '1px solid #e8c8c8',
                                                borderRadius: 6,
                                                padding: '6px 10px',
                                            }}
                                        >
                                            {error}
                                        </div>
                                    )}
                                    <div className="cc-input-inner">
                                        <input
                                            className="cc-input"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="Type a message…"
                                            disabled={sending}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    submit(e as any);
                                                }
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !text.trim()}
                                            className="ap-btn ap-btn-primary"
                                            style={{ flexShrink: 0, padding: '8px 14px', opacity: sending ? 0.6 : 1 }}
                                        >
                                            <Send style={{ width: 15, height: 15 }} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7e68', fontSize: 13 }}>
                                Select an order to start chatting.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </RiderLayout>
    );
}
