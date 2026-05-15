import { 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  ExternalLink, 
  Download, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { PDDRegistration } from '../types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RecordsListProps {
  registrations: PDDRegistration[];
  onDelete: (id: string) => void;
}

export default function RecordsList({ registrations, onDelete }: RecordsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Archived'>('All');

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.patientName.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.patientName.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.pin.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || reg.recordStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter my applications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100 text-sm">
          <Download className="w-4 h-4" />
          Download Summary
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Application Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">My PhilHealth PIN</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Dialysis Start</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Submission Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-medium">You haven't submitted any applications yet.</p>
                      <button onClick={() => {setSearchTerm(''); setStatusFilter('All');}} className="mt-2 text-emerald-600 hover:underline text-sm font-semibold">Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {filteredRegistrations.map((reg) => (
                    <motion.tr 
                      key={reg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700 shadow-sm shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">
                              {reg.regType}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 capitalize">{reg.hdDetails.type} Dialyzer</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {reg.pin}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium italic">
                        {reg.dialysisStartDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          reg.recordStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                          reg.recordStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                          'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             reg.recordStatus === 'Active' ? 'bg-emerald-500' : 
                             reg.recordStatus === 'Pending' ? 'bg-amber-500' : 'bg-slate-400'
                          }`}></span>
                          {reg.recordStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                        {new Date(reg.createdAt).toLocaleString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this record?')) {
                                onDelete(reg.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )
            }
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Showing {filteredRegistrations.length} of {registrations.length} total records</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:border-emerald-500 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
