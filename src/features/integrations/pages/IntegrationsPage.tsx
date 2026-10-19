import React, { useState, useEffect } from 'react';
import { 
  Globe, Zap, ArrowUpRight, Copy, Check, RefreshCw, Send, 
  ShieldCheck, Smartphone, Monitor, QrCode, ExternalLink, 
  Settings, CheckCircle2, AlertTriangle, Layers, Store, Bike, Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Channel {
  id: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  webhookUrl: string;
  autoAccept: boolean;
  prepTimeMinutes: number;
  markupPercentage: number;
  commissionPercentage: number;
  status: string;
  ordersToday: number;
  revenueToday: number;
}

export function IntegrationsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Webhook Simulator state
  const [simChannel, setSimChannel] = useState('ubereats');
  const [simCustomerName, setSimCustomerName] = useState('Sarah Jenkins');
  const [simItemName, setSimItemName] = useState('Chicken Chowmein — Medium');
  const [simQty, setSimQty] = useState(2);
  const [simPrice, setSimPrice] = useState(240);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'AGGREGATORS' | 'SIMULATOR' | 'PORTALS' | 'ARCHITECTURE'>('AGGREGATORS');

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations/channels');
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels || []);
      }
    } catch (err) {
      console.warn('Could not fetch aggregator channels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleChannel = async (channelId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/integrations/channels/${channelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus })
      });
      if (res.ok) {
        setChannels(prev => prev.map(c => c.id === channelId ? { ...c, enabled: !currentStatus } : c));
      }
    } catch (err) {
      console.error('Toggle channel failed:', err);
    }
  };

  const handleRunSimulation = async () => {
    try {
      setIsSimulating(true);
      setSimulationResult(null);

      const payload = {
        channel: simChannel,
        externalOrderId: `EXT-${simChannel.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: simCustomerName,
        customerPhone: '+91 98765 43210',
        deliveryAddress: 'Flat 402, Royal Palms Heights, Tech Park Road',
        items: [
          {
            name: simItemName,
            quantity: Number(simQty),
            price: Number(simPrice),
            size: 'Medium',
            notes: 'Less spicy, contact-free delivery'
          }
        ]
      };

      const res = await fetch(`/api/integrations/order-webhook?channel=${simChannel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setSimulationResult(data);
      // Refresh channels count
      fetchChannels();
    } catch (err: any) {
      setSimulationResult({ error: err.message || 'Webhook simulation failed' });
    } finally {
      setIsSimulating(false);
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://talkos.app';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Omnichannel & Online Ordering Gateway
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect food delivery aggregators, customer self-ordering kiosks, and table QR menus to a single authoritative ERP core.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/kiosk"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Monitor className="w-4 h-4" /> Open Kiosk Mode
          </Link>
          <Link
            to="/order"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Smartphone className="w-4 h-4" /> Open Table QR Portal
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        {[
          { id: 'AGGREGATORS', label: 'Delivery Aggregators', icon: Bike },
          { id: 'SIMULATOR', label: 'Webhook Simulator & Tester', icon: Zap },
          { id: 'PORTALS', label: 'Kiosk & QR Ordering Links', icon: QrCode },
          { id: 'ARCHITECTURE', label: 'Unified ERP Architecture', icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: AGGREGATORS */}
      {activeTab === 'AGGREGATORS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {channels.map(channel => {
              const fullWebhookUrl = `${origin}${channel.webhookUrl}`;

              return (
                <div 
                  key={channel.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-700 dark:text-slate-200 text-base">
                          {channel.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                            {channel.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-2 h-2 rounded-full ${channel.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span className="text-xs font-semibold text-slate-500 capitalize">
                              {channel.enabled ? 'Connected' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleChannel(channel.id, channel.enabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          channel.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            channel.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Today's Orders</span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{channel.ordersToday}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Today's Revenue</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{channel.revenueToday.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Channel Configuration details */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span>Auto-Accept:</span>
                        <span className="font-bold">{channel.autoAccept ? 'Enabled (Direct to KDS)' : 'Manual Review'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prep Time Buffer:</span>
                        <span className="font-bold">{channel.prepTimeMinutes} mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aggregator Markup:</span>
                        <span className="font-bold">+{channel.markupPercentage}%</span>
                      </div>
                    </div>

                    {/* Webhook Endpoint copy */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Authoritative Ingestion Webhook URL:
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300">
                        <span className="truncate flex-1">{fullWebhookUrl}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(fullWebhookUrl, channel.id)}
                          className="p-1 hover:text-indigo-600 shrink-0"
                          title="Copy Webhook URL"
                        >
                          {copiedKey === channel.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Commission: {channel.commissionPercentage}%</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setSimChannel(channel.id);
                        setActiveTab('SIMULATOR');
                      }}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" /> Test Webhook
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WEBHOOK SIMULATOR */}
      {activeTab === 'SIMULATOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Aggregator Webhook Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Dispatch simulated incoming order webhooks from UberEats, DoorDash, Zomato, or Swiggy to verify real-time ingestion into POS and Kitchen (KDS).
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Source Aggregator Channel:
                </label>
                <select
                  value={simChannel}
                  onChange={(e) => setSimChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="ubereats">Uber Eats</option>
                  <option value="doordash">DoorDash</option>
                  <option value="zomato">Zomato</option>
                  <option value="swiggy">Swiggy</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Customer Name:
                </label>
                <input
                  type="text"
                  value={simCustomerName}
                  onChange={(e) => setSimCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Dish Name:
                  </label>
                  <input
                    type="text"
                    value={simItemName}
                    onChange={(e) => setSimItemName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Price (₹):
                  </label>
                  <input
                    type="number"
                    value={simPrice}
                    onChange={(e) => setSimPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isSimulating}
                onClick={handleRunSimulation}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting Webhook...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch Simulated {simChannel.toUpperCase()} Order</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Webhook Response & Live Inspection */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-mono text-xs font-bold text-indigo-400">POST /api/integrations/order-webhook</span>
                <span className="text-[10px] text-slate-500 font-mono">Status: 201 Created</span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Authoritative Server Response:
                </span>
                {simulationResult ? (
                  <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                    {JSON.stringify(simulationResult, null, 2)}
                  </pre>
                ) : (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
                    Click "Dispatch Simulated Order" to view real-time ingestion log and ERP order creation.
                  </div>
                )}
              </div>
            </div>

            {simulationResult?.orderNumber && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                <span>Order <strong>{simulationResult.orderNumber}</strong> now active on KDS Kitchen Screen!</span>
                <Link to="/kds" className="font-bold underline text-white hover:text-emerald-300">
                  Open Kitchen Screen →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PORTALS */}
      {activeTab === 'PORTALS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kiosk Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Monitor className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Ready for Hardware Deployment
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Customer Self-Ordering Kiosk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Standalone, touch-optimized kiosk interface with attract screensavers, combo builders, card/UPI/cash payment choices, and automatic buzzer tokens.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300">
              {`${origin}/kiosk`}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/kiosk"
                target="_blank"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Launch Full-Screen Kiosk
              </Link>
              <button
                type="button"
                onClick={() => handleCopy(`${origin}/kiosk`, 'kiosk_link')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50"
              >
                {copiedKey === 'kiosk_link' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Table QR Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                Mobile Web / PWA
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Table QR Dine-In Ordering
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Customers scan a QR code at their table with their phone camera to browse the menu, customize portions, order, and track live kitchen prep steps.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300">
              {`${origin}/order?table=T1`}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/order?table=T1"
                target="_blank"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test Table Ordering
              </Link>
              <Link
                to="/tables"
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50"
              >
                Print Stand QRs
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UNIFIED ARCHITECTURE */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Cross-Platform Authoritative ERP Core
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Zero duplicate business logic. Every platform operates against the same backend models, validation, and real-time Firestore database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <Smartphone className="w-5 h-5 mx-auto text-indigo-500" />
              <div className="font-bold">Android & iOS</div>
              <div className="text-[10px] text-slate-400">Capacitor Native App</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <Monitor className="w-5 h-5 mx-auto text-indigo-500" />
              <div className="font-bold">Windows & macOS</div>
              <div className="text-[10px] text-slate-400">Desktop Electron App</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <Monitor className="w-5 h-5 mx-auto text-indigo-500" />
              <div className="font-bold">Touch Kiosks</div>
              <div className="text-[10px] text-slate-400">Standalone Touch Mode</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <QrCode className="w-5 h-5 mx-auto text-indigo-500" />
              <div className="font-bold">Table QR Web</div>
              <div className="text-[10px] text-slate-400">Camera Scan Mobile Web</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <Bike className="w-5 h-5 mx-auto text-indigo-500" />
              <div className="font-bold">Aggregators</div>
              <div className="text-[10px] text-slate-400">UberEats / DoorDash / Zomato</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Single Source of Authoritative Rules
            </h4>
            <p className="leading-relaxed">
              When an order is created anywhere—whether by a customer tapping on a kiosk, a diner scanning table QR, a cashier typing on desktop POS, or an aggregator webhook—it routes through the authoritative ERP backend. The system calculates identical taxes, records stock deductions in inventory, and transmits tickets to KDS without discrepancies.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
