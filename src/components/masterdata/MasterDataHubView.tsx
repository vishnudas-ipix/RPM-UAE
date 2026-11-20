import React, { useState } from 'react';
import {
  Database,
  Building,
  Truck,
  Users,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Upload,
  Lock,
  Download,
  Filter
} from 'lucide-react';
import { UAEProjectCategory, UserRole } from '../../types';

interface MasterDataHubViewProps {
  currentRole: UserRole;
}

export const MasterDataHubView: React.FC<MasterDataHubViewProps> = ({
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'vendors' | 'checklists'>('categories');

  // UAE Categories State (with Client Document Access setting)
  const [categories, setCategories] = useState([
    {
      code: 'ADNOC',
      name: 'ADNOC Offshore / Onshore Sites',
      clientDocAccess: 'View Only' as 'View Only' | 'Download Enabled',
      complianceRule: 'ADNOC HSE induction, site access pass, ADNOC-approved ambulance permit',
      activeProjects: 4,
    },
    {
      code: 'Government',
      name: 'Abu Dhabi Government / Federal Entities',
      clientDocAccess: 'View Only' as 'View Only' | 'Download Enabled',
      complianceRule: 'Standard DOH facility & clinician licensing; ADOSH medical coverage plan',
      activeProjects: 6,
    },
    {
      code: 'Semi-Government',
      name: 'Semi-Government Free Zones & Infrastructure',
      clientDocAccess: 'View Only' as 'View Only' | 'Download Enabled',
      complianceRule: 'DOH license compliance; site-specific security induction passes',
      activeProjects: 3,
    },
    {
      code: 'Private',
      name: 'Private Commercial & Industrial Sector',
      clientDocAccess: 'Download Enabled' as 'View Only' | 'Download Enabled',
      complianceRule: 'Standard DOH/DHA license compliance; commercial client agreements',
      activeProjects: 8,
    },
    {
      code: 'Event',
      name: 'Temporary Event Medical Standby Deployments',
      clientDocAccess: 'Download Enabled' as 'View Only' | 'Download Enabled',
      complianceRule: 'DOH event permit, ADOSH event risk category, temporary staging setup',
      activeProjects: 5,
    },
  ]);

  // Vendors Master
  const [vendors, setVendors] = useState([
    {
      id: 'ven-001',
      name: 'Thrifty Fleet Leasing UAE',
      category: 'Rental Vehicle Company',
      contractRef: 'VND-FLT-2025-091',
      emirate: 'Dubai',
      activeUnits: 6,
      status: 'Active',
    },
    {
      id: 'ven-002',
      name: 'Al Sahel Logistics & Transport Partners',
      category: 'Manpower Supply Company',
      contractRef: 'VND-MAN-2024-118',
      emirate: 'Abu Dhabi',
      activeUnits: 14,
      status: 'Active',
    },
    {
      id: 'ven-003',
      name: 'Emirates Motor Company (EMC Mercedes)',
      category: 'Ambulance Maintenance Partner',
      contractRef: 'VND-MNT-2026-004',
      emirate: 'Abu Dhabi',
      activeUnits: 12,
      status: 'Active',
    },
  ]);

  const toggleCategoryAccess = (code: string) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.code === code) {
          return {
            ...cat,
            clientDocAccess: cat.clientDocAccess === 'View Only' ? 'Download Enabled' : 'View Only',
          };
        }
        return cat;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Master Data Management & UAE Catalogs
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 12 (UAE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Corporate Admin manages UAE-specific project categories (ADNOC, Govt, Semi-Govt, Private, Event), client document access controls (View Only vs Download Enabled), vendor masters, and DOH equipment templates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300">
            Admin Controlled
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeTab === 'categories'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          UAE Project Category Master & Client Doc Access
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeTab === 'vendors'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Vendor Management Master (Fleet & Staff Suppliers)
        </button>
        <button
          onClick={() => setActiveTab('checklists')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeTab === 'checklists'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          DOH Equipment & Clinic Checklists
        </button>
      </div>

      {/* Tab 1: Category Master */}
      {activeTab === 'categories' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 uppercase">
                Section 5.2.2: UAE Project Category Master (Corporate Admin Managed)
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Replaces KSA ARAMCO/NEOM categories. Configures whether client can view only or download documents from the Stage 3A watermarked document pack web portal.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Entity Isolated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Category Code</th>
                  <th className="py-3 px-3">Description & Scope</th>
                  <th className="py-3 px-3">Compliance Requirements</th>
                  <th className="py-3 px-3">Client Doc Access Setting</th>
                  <th className="py-3 px-4 text-right">Configure Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.code} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-rpm-navy-700 block font-mono">{cat.code}</span>
                      <span className="text-[10px] text-slate-400">{cat.activeProjects} active contracts</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{cat.name}</td>
                    <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs">{cat.complianceRule}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cat.clientDocAccess === 'View Only'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {cat.clientDocAccess}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleCategoryAccess(cat.code)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors"
                      >
                        Toggle: {cat.clientDocAccess === 'View Only' ? 'Enable Download' : 'Set View Only'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Vendor Master */}
      {activeTab === 'vendors' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 uppercase">
                Section 16.5: Vendor Management Master
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Maintains approved rental ambulance providers and manpower supply agencies for UAE operations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vendors.map((ven) => (
              <div key={ven.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{ven.contractRef}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {ven.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{ven.name}</h4>
                <p className="text-[11px] text-rpm-navy-700 font-semibold">{ven.category}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                  <span>Emirate: <strong>{ven.emirate}</strong></span>
                  <span>Active Deployed: <strong>{ven.activeUnits}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Checklists */}
      {activeTab === 'checklists' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase">
              Section 16.6: DOH Equipment Standards Checklist Templates
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Configured templates aligned with current Department of Health (DOH) Ambulance Service circulars.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-xs">DOH Ambulance Standards Checklist (Default UAE Template):</span>
              <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-1 pl-2">
                <li>Defibrillator with ECG telemetry (Zoll / Corpuls / LifePak) calibration within 365 days</li>
                <li>Transport ventilator with oxygen pressure sensor test passed</li>
                <li>Suction unit battery backup test (min 45 mins continuous operational runtime)</li>
                <li>Narcotics & controlled medications lockbox seal intact with supervisor verification</li>
                <li>Spine board, scoop stretcher, cervical collar set, and Kendrick Extrication Device (KED)</li>
                <li>Ambulance Coordinator physical sign-off stamp</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

