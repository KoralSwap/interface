import { Line, AreaClosed } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { Brush } from "@visx/brush";
import { Group } from "@visx/group";
import * as Curve from "@visx/curve";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrushHandleRenderProps } from "@visx/brush/lib/BrushHandle";
import BaseBrush, { BaseBrushState } from "@visx/brush/lib/BaseBrush";
import { Bounds, Point } from "@visx/brush/lib/types";
import { CircleOff } from "lucide-react";

const allRoundMargin = 10;

interface PriceData {
  priceY: number;
  priceX: number;
  matchesCurrentTick: boolean;
  isUndefined?: boolean;
}

interface Props {
  priceData: PriceData[];
  width?: number | string;
  height?: number;
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange?: (minPrice: number) => void;
  onMaxPriceChange?: (maxPrice: number) => void;
  xDomain?: [number, number];
}

function PercentageChangeIndicator({
  x,
  y,
  text,
}: {
  x: number;
  y: number;
  text: string;
}) {
  return (
    <Group left={5} top={3}>
      <rect
        width={50}
        height={30}
        rx={5}
        ry={5}
        x={x}
        y={y}
        fill="#272734"
        stroke="#272734"
        strokeWidth={1}
      />
      <text
        x={x + 25}
        width={10}
        y={y + 15}
        className="text-[#fff] text-[10px]"
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {text}
      </text>
    </Group>
  );
}

function BrushHandle({
  x,
  height,
  isBrushActive,
  className,
  width,
}: BrushHandleRenderProps) {
  if (!isBrushActive) {
    return null;
  }

  const isLeft = className.includes("left");
  return (
    <Group left={x} top={0}>
      <rect
        width={20}
        height={30}
        fill="#8062F1"
        fillOpacity={1}
        stroke="#8062F1"
        strokeWidth={1}
        rx={5}
        ry={5}
        x={isLeft ? width - 20 : 2}
      />
      <rect
        width={1}
        height={10}
        fill="#fff"
        fillOpacity={1}
        stroke="#fff"
        strokeWidth={1}
        rx={2}
        ry={2}
        x={isLeft ? width - 13 : 9}
        y={10}
      />
      <rect
        width={1}
        height={10}
        fill="#fff"
        fillOpacity={1}
        stroke="#fff"
        strokeWidth={1}
        rx={2}
        ry={2}
        x={isLeft ? width - 9 : 13}
        y={10}
      />
      <rect
        width={4}
        height={height}
        fill="#8062F1"
        fillOpacity={1}
        stroke="none"
        x={isLeft ? width - 2 : 2}
      />
    </Group>
  );
  // return (
  //   <Group left={x + pathWidth / 2} top={0}>
  //     <path
  //       fill="#8062f1"
  //       d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
  //       stroke="#8062f1"
  //       strokeWidth="1"
  //       style={{ cursor: 'ew-resize' }}
  //     />
  //   </Group>
  // );
}

export default function RangeVisualizationChart({
  priceData,
  width = "100%",
  height = 500,
  minPrice = 0,
  maxPrice = 0,
  onMinPriceChange,
  onMaxPriceChange,
  xDomain = [0, 100],
}: Props) {
  const [refHeight, setRefHeight] = useState(0);
  const [refWidth, setRefWidth] = useState(0);
  const rectRef = useCallback((node: SVGRectElement) => {
    if (node !== null) {
      const boundingRect = node.getBoundingClientRect();
      setRefHeight(boundingRect.height);
      setRefWidth(boundingRect.width);
    }
  }, []);

  const brushRef = useRef<BaseBrush | null>(null);
  const priceScaleX = useMemo(
    () =>
      scaleLinear({
        range: [0, refWidth],
        domain: xDomain,
        nice: true,
      }),
    [refWidth, xDomain]
  );

  const priceScaleY = useMemo(
    () =>
      scaleLinear({
        range: [refHeight - allRoundMargin * 3, 0],
        domain: [0, Math.max(...priceData.map((datum) => datum.priceY))],
        nice: true,
      }),
    [priceData, refHeight]
  );

  const currentTickData = useMemo(
    () => priceData.find((p) => p.matchesCurrentTick),
    [priceData]
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: priceScaleX(minPrice) },
      end: { x: priceScaleX(maxPrice) },
    }),
    [maxPrice, minPrice, priceScaleX]
  );

  const onBrushChange = useCallback(
    (args: Bounds | null) => {
      if (!args || (brushRef.current && !brushRef.current.state.isBrushing))
        return;
      const { x0, x1 } = args;
      if (onMinPriceChange) onMinPriceChange(x0);
      if (onMaxPriceChange) onMaxPriceChange(x1);
    },
    [onMaxPriceChange, onMinPriceChange]
  );

  const percentageChangeX0 = useMemo(() => {
    if (!currentTickData) return 0;
    const percentage =
      ((minPrice - currentTickData.priceX) * 100) / currentTickData.priceX;
    return percentage;
  }, [currentTickData, minPrice]);

  const percentageChangeX1 = useMemo(() => {
    if (!currentTickData) return 0;
    const percentage =
      ((maxPrice - currentTickData.priceX) * 100) / currentTickData.priceX;
    return percentage;
  }, [currentTickData, maxPrice]);

  useEffect(() => {
    if (brushRef.current && !brushRef.current.state.isBrushing) {
      brushRef.current.updateBrush((currBrushState) => {
        if (!brushRef.current) return currBrushState;
        const start: Partial<Point> = {
          x: priceScaleX(minPrice),
        };
        const end: Partial<Point> = {
          x: priceScaleX(maxPrice),
        };
        const newExtent = brushRef.current.getExtent(start, end);

        const newState: BaseBrushState = {
          ...currBrushState,
          start: { x: newExtent.x0, y: newExtent.y0 },
          end: { x: newExtent.x1, y: newExtent.y1 },
          extent: newExtent,
        };
        return newState;
      });
    }
  }, [maxPrice, minPrice, priceScaleX]);

  return (
    <div className="w-full bg-[#16161d]">
      {priceData.length > 0 ? (
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={14}
            fill="transparent"
            ref={rectRef}
          />
          {/* <LinePath
          data={data}
          x={(d) => xScale(d.x) ?? 0}
          y={(d) => yScale(d.y) ?? 0}
          strokeWidth={1}
          stroke="#8062f1"
          strokeOpacity={1}
          opacity={0.7}
          curve={Curve.curveBundle}
        /> */}
          {/* <Group top={allRoundMargin / 2}>
          {filteredPriceData.map((d, i, arr) => {
            const barX = priceScaleX(d.priceX);
            const barY = priceScaleY(d.priceY);
            const nextX = i < arr.length - 1 ? priceScaleX(arr[i + 1].priceX) : priceScaleX(d.priceX + 20);
            const barWidth = nextX - barX;
            // console.log(barY);
            const barHeight = (refHeight - allRoundMargin * 3) - barY;
            return (
              <Bar
                key={i}
                x={barX}
                y={barY}
                height={barHeight}
                width={barWidth}
                fill="#8062f1"
                opacity={0.09}
                radius={10}
              />
            );
          })}
        </Group> */}
          <Group top={allRoundMargin / 2}>
            <AreaClosed
              data={priceData}
              x={(d) => priceScaleX(d.priceX)}
              y={(d) => priceScaleY(d.priceY)}
              yScale={priceScaleY}
              strokeWidth={1}
              stroke="#180584"
              fill="#180584"
              opacity={0.09}
              curve={Curve.curveStep}
            />
            <AxisBottom
              top={refHeight - allRoundMargin * 3}
              scale={priceScaleX}
              numTicks={8}
              strokeWidth={1}
              stroke="#8062f1"
              tickStroke="#fff"
              tickLabelProps={{
                fill: "#858591",
                fontSize: 10,
                fontWeight: 400,
              }}
              tickFormat={(value) => {
                const formatter = new Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 3,
                  maximumSignificantDigits: 6,
                  notation: "compact",
                  compactDisplay: "short",
                });
                return formatter.format(value.valueOf());
              }}
            />
          </Group>
          <Group>
            {currentTickData && (
              <PercentageChangeIndicator
                x={priceScaleX(minPrice) - 78}
                y={priceScaleY(Math.max(...priceScaleY.domain())) - 3}
                text={`${percentageChangeX0.toFixed(2)}%`}
              />
            )}
            <Brush
              disableDraggingOverlay
              xScale={priceScaleX}
              yScale={priceScaleY}
              height={refHeight - allRoundMargin * 2.5}
              width={refWidth - allRoundMargin}
              resizeTriggerAreas={["left", "right"]}
              handleSize={8}
              innerRef={brushRef}
              brushDirection="horizontal"
              initialBrushPosition={initialBrushPosition}
              onChange={onBrushChange}
              renderBrushHandle={(props) => <BrushHandle {...props} />}
              selectedBoxStyle={{
                fill: "#8062f1",
                fillOpacity: 0.07,
                stroke: "none",
                strokeWidth: 1,
              }}
            />
            {currentTickData && (
              <PercentageChangeIndicator
                x={priceScaleX(maxPrice) + 19}
                y={priceScaleY(Math.max(...priceScaleY.domain())) - 3}
                text={`${percentageChangeX1.toFixed(2)}%`}
              />
            )}
          </Group>
          {currentTickData && (
            <Line
              x1={priceScaleX(currentTickData.priceX)}
              x2={priceScaleX(currentTickData.priceX)}
              y1={refHeight - allRoundMargin * 2.5}
              y2={allRoundMargin * 3}
              fill="#fff"
              stroke="#fff"
              strokeWidth={1}
            />
          )}
          {/* <Group top={allRoundMargin / 2}>
          {priceRangeInUSD1.map((d) => {
            const barHeight =
              refHeight - allRoundMargin * 4 - (priceScaleUSD1Y(d.y) ?? 0);
            const barY = refHeight - allRoundMargin * 3.6 - barHeight;
            return (
              <Bar
                key={d.x}
                x={priceScaleUSD1X(d.x)}
                y={barY}
                height={barHeight}
                width={8}
                fill="#8062f1"
                opacity={0.03}
                radius={10}
              />
            );
          })}
        </Group> */}

          {/* <rect
          x={priceScaleX(minPrice)}
          fill="#8062f1"
          fillOpacity={0.07}
          y={allRoundMargin * 4}
          height={refHeight - allRoundMargin * 7}
          width={priceScaleX(maxPrice) - priceScaleX(minPrice)}
        />

        <Drag
          x={priceScaleX(minPrice)}
          height={refHeight}
          width={refWidth}
          restrict={{ yMin: 0, yMax: 0 }}
          onDragMove={onDragMoveMin}
          onDragEnd={onDragMoveMin}
          onDragStart={onDragMoveMin}
          resetOnStart
        >
          {({ dragStart, dragEnd, dragMove, isDragging, x = 0, dx }) => (
            <g>
              <line
                stroke="#fff"
                fill="#fff"
                strokeWidth={1}
                x={x - 19 + dx}
                height={43}
                width={8}
              />
              <rect
                fill={isDragging ? "#fff" : "#8062f1"}
                y={allRoundMargin * 3}
                ry={5}
                x={x - 19 + dx}
                width={20}
                height={30}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchMove={dragMove}
                onTouchStart={dragStart}
                onTouchEnd={dragEnd}
              />
              <Line
                fill="#fff"
                stroke={isDragging ? "#fff" : "#8062f1"}
                strokeWidth={4}
                cx={x + dx}
                x1={x + dx}
                x2={x + dx}
                y1={refHeight - allRoundMargin * 3}
                y2={allRoundMargin * 3}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchMove={dragMove}
                onTouchStart={dragStart}
                onTouchEnd={dragEnd}
              />
            </g>
          )}
        </Drag>

        <Drag
          x={priceScaleX(maxPrice)}
          height={refHeight}
          width={refWidth}
          restrict={{ yMin: 0, yMax: 0 }}
          onDragMove={onDragMoveMax}
          onDragEnd={onDragMoveMax}
          onDragStart={onDragMoveMax}
          resetOnStart
        >
          {({ dragStart, dragEnd, dragMove, isDragging, x = 0, dx }) => (
            <g>
              <Line
                fill="#fff"
                stroke={isDragging ? "#fff" : "#8062f1"}
                strokeWidth={4}
                cx={x + dx}
                x1={x + dx}
                x2={x + dx}
                y1={refHeight - allRoundMargin * 3}
                y2={allRoundMargin * 3}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchMove={dragMove}
                onTouchStart={dragStart}
                onTouchEnd={dragEnd}
              />
              <rect
                fill={isDragging ? "#fff" : "#8062f1"}
                y={allRoundMargin * 3}
                ry={5}
                x={x - 1 + dx}
                width={20}
                height={30}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchMove={dragMove}
                onTouchStart={dragStart}
                onTouchEnd={dragEnd}
              />
            </g>
          )}
        </Drag> */}
          {/* <Line
          from={maxPriceLineCoordinates.from}
          to={maxPriceLineCoordinates.to}
          fill="#fff"
          stroke="#fff"
          strokeWidth={1}
        /> */}
        </svg>
      ) : (
        <div
          className="w-full bg-neutral-950 flex flex-col gap-y-7 justify-center items-center"
          style={{ height }}
        >
          <CircleOff size={100} className="text-neutral-1000" />
          <span className="text-neutral-800 text-sm lg:text-lg">
            No market data
          </span>
        </div>
      )}
    </div>
  );
}
