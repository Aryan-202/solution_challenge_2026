'use client';
import { useViolations } from '@/hooks/useViolations';
import { useAssets } from '@/hooks/useAssets';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// Fix Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons based on similarity
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const redIcon = createCustomIcon('#ef4444');
const orangeIcon = createCustomIcon('#f97316');
const yellowIcon = createCustomIcon('#eab308');

export default function SpreadMap() {
  const { violations } = useViolations();
  const { assets } = useAssets();

  // Sort and count countries for bar chart
  const countryCounts: Record<string, number> = {};
  violations.forEach(v => {
    countryCounts[v.geoLocation.country] = (countryCounts[v.geoLocation.country] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Sort and count platforms
  const platformCounts: Record<string, number> = {};
  violations.forEach(v => {
    platformCounts[v.platform] = (platformCounts[v.platform] || 0) + 1;
  });
  const topPlatforms = Object.entries(platformCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm h-[400px] md:h-[500px] relative z-0">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {violations.map((violation) => {
            const asset = assets.find(a => a.id === violation.assetId);
            const icon = violation.similarityScore >= 90 ? redIcon :
                         violation.similarityScore >= 70 ? orangeIcon : yellowIcon;

            return (
              <Marker 
                key={violation.id} 
                position={[violation.geoLocation.lat, violation.geoLocation.lng]}
                icon={icon}
              >
                <Popup className="custom-popup">
                  <div className="p-1">
                    <p className="font-bold text-slate-800 mb-1">{violation.platform}</p>
                    <p className="text-xs text-slate-600 mb-2 truncate max-w-[180px]">{asset?.name}</p>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-red-600 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded">
                        {violation.similarityScore}% Match
                      </span>
                      <span className="text-slate-500">
                        {format(new Date(violation.detectedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Total Spread Highlights</h3>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{violations.length}</span>
            <span className="text-slate-500 mb-1 font-medium">Total Violations</span>
          </div>
          
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Top Platforms</h4>
          <div className="space-y-3">
            {topPlatforms.map((p, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-800 dark:text-slate-200">{p.name}</span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-0.5 px-2 rounded-full font-mono">
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Top Countries</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCountries} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} className="text-xs font-medium text-slate-600 dark:text-slate-400" />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {topCountries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={'#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
