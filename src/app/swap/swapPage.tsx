import { Card } from "@/components/ui/card";
import SwapView from "./__components__/swapView";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import SettingsDialog from "./__components__/settingsDialog";

export default function SwapPage() {
  return (
    <PageMarginContainer>
      <div className="mx-auto w-full max-w-[440px] px-4 sm:px-0">
        <div className="py-4">
          <div className="py-2 flex items-end justify-between">
            <h1 className="text-primary-400 text-3xl sm:text-[44px] leading-tight sm:leading-[44px]">
              Trade
            </h1>
            <div>
              <SettingsDialog />
            </div>
          </div>
        </div>
        <Card className="w-full p-0 rounded-md">
          <SwapView />
        </Card>
      </div>
    </PageMarginContainer>
  );
}
