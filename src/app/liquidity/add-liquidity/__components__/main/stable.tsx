import { Card } from "@/components/ui/card";
// import AssetCard from "./assetCard";
import { Button } from "@/components/ui/button";
// import { USDC_ADDRESS } from "@/data/constants";

export default function Stable() {
  return (
    <>
      <h2 className="text-xl">Add C.Stable Liquidity</h2>
      <StableInfo />
      <div className="space-y-2">
        <div>
          <label htmlFor="">Asset 1</label>
        </div>
        {/* <AssetCard */}
        {/*   tokenAddress={"0x"} */}
        {/*   set={function (address: string): void { */}
        {/*     console.log(address); */}
        {/*     throw new Error("Function not implemented."); */}
        {/*   }} */}
        {/*   tokenAmount={""} */}
        {/* /> */}
      </div>
      <div className="space-y-2">
        <div>
          <label htmlFor="">Asset 2</label>
        </div>
        {/* <AssetCard */}
        {/*   tokenAddress={USDC_ADDRESS} */}
        {/*   setTokenAmount={function (_address: string): void { */}
        {/*     console.log(_address); */}
        {/*     throw new Error("Function not implemented."); */}
        {/*   }} */}
        {/*   tokenAmount={""} */}
        {/* /> */}
      </div>
      <StableStats />
      <Button variant="primary" disabled size="submit">
        Add Liquidity
      </Button>
    </>
  );
}

function StableInfo() {
  return (
    <Card
      className="grid text-sm grid-cols-3 py-2 px-4 items-center rounded-md"
      bg="950"
      border="900"
    >
      <div className="">
        <h1 className="text-neutral-300">APR</h1>
        <h2>0%</h2>
      </div>
      <div className="">
        <h1 className="text-neutral-300">APR</h1>
        <h2>0%</h2>
      </div>
      <div className="">
        <h1 className="text-neutral-300">APR</h1>
        <h2>0%</h2>
      </div>
    </Card>
  );
}
function StableStats() {
  return (
    <>
      <div className="space-y-2">
        <h4 className="text-neutral-100 ">Reserve Info</h4>
        <div className="flex text-sm text-neutral-300 justify-between">
          <span>UDT Amount</span>
          <span>337.3</span>
        </div>
        <div className="flex text-sm text-neutral-300 justify-between">
          <span>USDC Amount</span>
          <span>130.3</span>
        </div>
      </div>
      <div className="">
        <h5>My Info</h5>
        <div className="pt-1"></div>
        <div className="flex text-neutral-300 text-sm justify-between">
          <span>USDC per USDT</span>
          <span>0 LP</span>
        </div>
      </div>
    </>
  );
}
