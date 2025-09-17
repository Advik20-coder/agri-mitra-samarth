import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, X } from "lucide-react";

interface GuidancePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GuidancePopup = ({ open, onOpenChange }: GuidancePopupProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {t.guidanceVideoTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Coming Soon - Watch how to use this smart agriculture platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
            <Play className="h-12 w-12 text-white ml-1" />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This guidance video will help you:
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Navigate the platform easily</li>
              <li>• Use AI assistant effectively</li>
              <li>• Upload images for analysis</li>
              <li>• Get location-based advice</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};