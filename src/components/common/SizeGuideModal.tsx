import React from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeTable = [
    { usMen: '7.0', usWomen: '8.5', uk: '6.0', eu: '40.0', cm: '25.0' },
    { usMen: '7.5', usWomen: '9.0', uk: '6.5', eu: '40.5', cm: '25.5' },
    { usMen: '8.0', usWomen: '9.5', uk: '7.0', eu: '41.0', cm: '26.0' },
    { usMen: '8.5', usWomen: '10.0', uk: '7.5', eu: '42.0', cm: '26.5' },
    { usMen: '9.0', usWomen: '10.5', uk: '8.0', eu: '42.5', cm: '27.0' },
    { usMen: '9.5', usWomen: '11.0', uk: '8.5', eu: '43.0', cm: '27.5' },
    { usMen: '10.0', usWomen: '11.5', uk: '9.0', eu: '44.0', cm: '28.0' },
    { usMen: '10.5', usWomen: '12.0', uk: '9.5', eu: '44.5', cm: '28.5' },
    { usMen: '11.0', usWomen: '12.5', uk: '10.0', eu: '45.0', cm: '29.0' },
    { usMen: '11.5', usWomen: '13.0', uk: '10.5', eu: '45.5', cm: '29.5' },
    { usMen: '12.0', usWomen: '13.5', uk: '11.0', eu: '46.0', cm: '30.0' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-shopora-card border border-shopora-border rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-shopora-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-shopora-accent/10 text-shopora-accent">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white tracking-wide">
                AUTHENTIC SIZING GUIDE
              </h3>
              <p className="text-xs text-shopora-muted">International Conversion Chart</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-shopora-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-shopora-dark/60 border border-shopora-border text-xs text-slate-300 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-shopora-accent shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Collector Fit Recommendation:</strong> Most Jordan 1s &amp; Dunks fit true to size (TTS). Yeezy 350s run small; order 0.5 size up. Salomon XT-6 fits snug around the arch.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-shopora-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-shopora-dark text-xs uppercase font-mono tracking-wider text-shopora-muted">
                <tr>
                  <th className="py-3 px-4">US Men</th>
                  <th className="py-3 px-4">US Women</th>
                  <th className="py-3 px-4">UK</th>
                  <th className="py-3 px-4">EU</th>
                  <th className="py-3 px-4 text-right">CM (Length)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shopora-border/60">
                {sizeTable.map((row) => (
                  <tr key={row.usMen} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-shopora-accent">{row.usMen}</td>
                    <td className="py-3 px-4 text-slate-300">{row.usWomen}</td>
                    <td className="py-3 px-4 text-slate-300">{row.uk}</td>
                    <td className="py-3 px-4 text-slate-300">{row.eu}</td>
                    <td className="py-3 px-4 text-right text-slate-300 font-mono">{row.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all"
          >
            Close Sizing Guide
          </button>
        </div>
      </div>
    </div>
  );
};
