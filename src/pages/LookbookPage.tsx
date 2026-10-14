import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Flame, ArrowRight } from 'lucide-react';

export const LookbookPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20 animate-fade-in">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shopora-accent/15 border border-shopora-accent/30 text-shopora-accent text-xs font-mono">
          <Flame className="w-3.5 h-3.5" />
          <span>VAULT ARCHIVE • VOLUME IV</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
          STREET ARCHIVE &amp; AUTHENTICITY MANIFESTO
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Where footwear curation meets rigorous physical provenance. In an era saturated with replicas, Shopora represents the uncompromised standard for deadstock grails.
        </p>
      </div>

      {/* Editorial Lookbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: 'Travis Scott Reverse Mocha',
            category: 'HOUSTON COLLAB',
            year: '2022',
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
            quote: 'Deconstructed nubuck overlays in earthy sail and ridgerock tones.',
            link: '/product/travis-scott-air-jordan-1-low-reverse-mocha',
          },
          {
            title: 'AJ1 Chicago Lost & Found',
            category: '1985 HERITAGE',
            year: '1985 / 2022',
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
            quote: 'Cracked ankle collars evoking forgotten sneaker boxes found in suburban basements.',
            link: '/product/air-jordan-1-retro-high-og-chicago-lost-and-found',
          },
          {
            title: 'Salomon XT-6 Black Obsidian',
            category: 'METROPOLITAN GORPCORE',
            year: '2023',
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
            quote: 'French trail performance engineered for wet asphalt and utilitarian silhouettes.',
            link: '/product/salomon-xt-6-gore-tex-cyber-black',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="group rounded-3xl bg-shopora-card border border-shopora-border overflow-hidden hover:border-shopora-accent/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-shopora-dark">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-shopora-accent border border-white/10 uppercase font-bold">
                {item.category}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center text-xs text-shopora-muted font-mono">
                <span>ARCHIVE RELEASE</span>
                <span>{item.year}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-shopora-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{item.quote}"
              </p>
              <div className="pt-2">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-shopora-accent hover:underline uppercase"
                >
                  <span>Inspect Grail in Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legit-Check Manifesto Details */}
      <section className="rounded-3xl bg-shopora-card border border-shopora-border p-8 sm:p-14 space-y-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-shopora-accent uppercase mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>HOW WE PROTECT COLLECTORS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            THE 14-POINT IN-HAND VERIFICATION STANDARD
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '1. UV Blacklight Spectroscopy',
              desc: 'High-frequency ultraviolet radiation detects invisible factory glue marks, stamps, and fraudulent stitch patterns invisible to the naked eye.',
            },
            {
              title: '2. Polyurethane Density Durometer',
              desc: 'We measure the exact Shore A durometer hardness of midsoles to verify proprietary Nike Zoom, Boost, or FuelCell compound densities.',
            },
            {
              title: '3. Digital NFC Cryptographic Vault Seal',
              desc: 'Every authenticated pair is fitted with an uncopyable tamper-evident NFC tag encrypted on our private provenance ledger.',
            },
            {
              title: '4. Box Font Kerning & Label Microprint',
              desc: 'Manufacturer label fonts are inspected under 40x optical magnification to confirm millimeter-accurate typographic kerning.',
            },
            {
              title: '5. Scent & Rubber Vulcanization',
              desc: 'Deadstock pairs emit distinctive factory curing aromatics. Chemical off-gassing of substandard replica glues is instantly caught.',
            },
            {
              title: '6. Double-Box Armored Courier Transport',
              desc: 'Parcels are wrapped in heavy-gauge crushproof outer boxes with reinforced tamper tape and signature-mandated receipt.',
            },
          ].map((standard, i) => (
            <div key={i} className="p-5 rounded-2xl bg-shopora-dark/60 border border-shopora-border space-y-2">
              <h4 className="font-display font-bold text-sm text-white">{standard.title}</h4>
              <p className="text-xs text-shopora-muted leading-relaxed">{standard.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <div className="text-center py-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-shopora-accent hover:bg-shopora-accentHover text-black font-display font-bold text-xs uppercase tracking-wider shadow-glow-accent transition-transform hover:scale-105"
        >
          <span>Explore Authenticated Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
