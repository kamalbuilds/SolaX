"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";



interface OverviewProps {
  poolData: { name: string; tokenSize: number; usdSize: number }[];
}



export function Overview({ poolData }: OverviewProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{`${label}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <Label>{`USD Value : $${Number(payload[0].value).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}`}</Label>
              <Label>{`Token Pool Size : ${payload[0].payload.tokenSize}`}</Label>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const validData = poolData.filter((data) => data.usdSize > 0);

  return (
    <div className="overflow-auto w-full h-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={validData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
  stroke="#888888"
  fontSize={12}
  tickLine={false}
  axisLine={false}
  scale="log"
  domain={['auto', 'auto']}
  tickFormatter={(value) => `$${value}`}
/>
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="usdSize" fill="#6D14FF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
