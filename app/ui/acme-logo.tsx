import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div className={`${lusitana.className} flex items-center justify-center text-white`}>
      <div className="relative">
        <div className="px-4 py-3 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg min-w-[120px]">
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="w-6 h-6 text-white flex-shrink-0" />
            <div className="text-center">
              <p className="text-lg font-bold text-white leading-tight">AUN</p>
              <p className="text-[10px] text-white leading-tight">WEB-BASED CHECKSHEET</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
