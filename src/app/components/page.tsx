"use client";
import SearchInput from "@/components/shared/searchInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Headers from "@/components/ui/headers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="py-10 mx-auto w-[880px] 2xl:w-[1500px]">
      <div className="space-y-4">
        <Headers.GradiantHeaderOne colorOne="#A0055D" colorTwo="#836EF9F2">
          Dashboard
        </Headers.GradiantHeaderOne>
        <Headers.InfoHeaderTwo
          popupContent={
            <div>
              <p>Info about something...</p>
            </div>
          }
        >
          Info Header
        </Headers.InfoHeaderTwo>
        <div className="w-[400px]">
          {/* <CurrencyInput.Root title="Sell" estimate="200"> */}
          {/*   <CurrencyInput.CurrencySelect */}
          {/*     tokenAddress="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" */}
          {/*     token="USDC" */}
          {/*   /> */}
          {/*   <CurrencyInput.NumberInput disabled={false} decimals={10} /> */}
          {/* </CurrencyInput.Root> */}
        </div>
        <div className="w-[400px]">
          <SearchInput
            value=""
            setValue={(s: string) => {
              console.log(s);
            }}
          />
        </div>
        <div>
          {/* <CurrenciesOverlapIcons */}
          {/*   tokenOne={{ */}
          {/*     alt: "a", */}
          {/*     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as TAddress, */}
          {/*   }} */}
          {/*   tokenTwo={{ */}
          {/*     alt: "a", */}
          {/*     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as TAddress, */}
          {/*   }} */}
          {/* /> */}
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <Button variant={"outline"} size="md">
              Button
            </Button>
          </div>
          <div>
            <Button variant={"outline"} size={"sm"}>
              Button
            </Button>
          </div>

          <div>
            <Button variant={"filled"} size={"sm"}>
              Button
            </Button>
          </div>
          <div>
            <Button variant={"outline"} size="xs">
              Button
            </Button>
          </div>

          <div>
            <Button variant={"primary"} size="md">
              Button
            </Button>
          </div>

          <div>
            <Button disabled={true} variant={"primary"} size="md">
              Button
            </Button>
          </div>
          <div>
            <Button variant={"primary"} size={"sm"}>
              Button
            </Button>
          </div>
          <div>
            <Button variant={"primary"} size="xs">
              Button
            </Button>
          </div>

          <div className="w-[300px]">
            <Button variant={"primary"} size="submit">
              Submit
            </Button>
          </div>
        </div>
        <div className="flex gap-x-4">
          <Badge colors="success" border="one">
            Badge
          </Badge>

          <Badge colors="error" border="one">
            Badge
          </Badge>

          <Badge colors="yellow" border="one">
            Badge
          </Badge>
          <Badge colors="primary" border="one">
            Badge
          </Badge>
        </div>
        <div>
          <Badge size={"md"} border={"none"} colors="yellow">
            Volatile
          </Badge>
          <div className="py-2">
            <Badge size={"full"} border={"none"} colors="yellow">
              Full
            </Badge>
          </div>
        </div>
        <div className="md:w-[400px] space-y-4">
          <Alert>
            <AlertDescription>
              <p className="text-[12px] ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae commodi quidem similique sed asperiores harum ullam
              </p>
            </AlertDescription>
          </Alert>

          <Alert colors={"error"}>
            <AlertDescription>
              <p className="text-[12px] ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae commodi quidem similique sed asperiores harum ullam
              </p>
            </AlertDescription>
          </Alert>
        </div>
        <Tabs defaultValue={"account"}>
          <TabsList defaultValue={"account"} colors={"muted"}>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="passwordi">lOrem</TabsTrigger>
          </TabsList>
        </Tabs>
        <p>Full</p>
        <div className="w-[600px]">
          <Tabs defaultValue={"account"}>
            <TabsList border={"border-1"} display={"grow"}>
              <TabsTrigger display={"grow"} value="account">
                Account
              </TabsTrigger>
              <TabsTrigger display={"grow"} value="password">
                Password
              </TabsTrigger>
              <TabsTrigger display={"grow"} value="passwordi">
                Password
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="py-4">
        <Tabs defaultValue={"account"}>
          <TabsList defaultValue={"account"}>
            <TabsTrigger colors={"white"} border={"primary-1"} value="account">
              Account
            </TabsTrigger>
            <TabsTrigger colors={"white"} border={"primary-1"} value="account1">
              Acc
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
