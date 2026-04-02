"use client";
import { useState } from "react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const tabs = ["Tất cả", "Xe tải", "Cần cẩu", "Kho bãi", "Công nghệ"];

export default function EquipmentGallery({ equipments = [] }: { equipments?: any[] }) {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filtered = activeTab === "Tất cả"
    ? equipments
    : equipments.filter((e) => e.category === activeTab);

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <ScrollReveal>
          <SectionHeading
            title="NĂNG LỰC & THIẾT BỊ"
            subtitle="Hệ thống thiết bị hiện đại đảm bảo chất lượng dịch vụ hàng đầu"
          />
        </ScrollReveal>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-sm font-body font-semibold text-sm transition-all duration-200 ${
                activeTab === tab
                  ? "text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={activeTab === tab ? { backgroundColor: "var(--orange)" } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="group bg-gray-50 rounded-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
                <div className="aspect-video w-full bg-gray-200">
                  {item.image ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                     <ImagePlaceholder label={item.name} className="w-full h-full rounded-none" aspectRatio="video" iconSize={24} />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{item.name}</h4>
                  <p className="text-gray-500 text-xs line-clamp-2">{item.desc}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-sm text-xs font-semibold text-white" style={{ backgroundColor: "var(--teal)" }}>
                    {item.category}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
