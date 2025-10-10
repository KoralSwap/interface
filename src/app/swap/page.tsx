import { Card } from "@/components/ui/card";
import SwapView from "./__components__/swapView";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import SettingsDialog from "./__components__/settingsDialog";
import { ArrowDownUp } from "lucide-react";

export default function Swap() {
  return (
    <PageMarginContainer>
      <div className="mx-auto max-w-[480px] py-8">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-lg shadow-blue-500/30">
                <ArrowDownUp size={24} />
              </div>
              <h1 className="text-4xl font-bold text-gradient">Swap</h1>
            </div>
            <SettingsDialog />
          </div>
          <p className="mt-4 text-sm text-neutral-400">
            Trade tokens instantly at the best rates
          </p>
        </div>

        <Card
          variant="elevated"
          hover="glow"
          p="none"
          className="overflow-hidden"
        >
          <SwapView />
        </Card>
      </div>
    </PageMarginContainer>
  );
}
