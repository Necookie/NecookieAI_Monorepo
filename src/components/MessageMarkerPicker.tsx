import {
  ColorPicker, ColorPickerArea, ColorPickerContent, ColorPickerHexInput,
  ColorPickerHue, ColorPickerPreset, ColorPickerPresets, ColorPickerSwatch,
  ColorPickerTrigger,
} from "./motion/color-picker";
import { useAppStore } from "../lib/context";

const PRESETS = [
  { value: "#171717", label: "Ink" },
  { value: "#404040", label: "Graphite" },
  { value: "#737373", label: "Stone" },
  { value: "#a3a3a3", label: "Silver" },
  { value: "#d4d4d4", label: "Cloud" },
];

export default function MessageMarkerPicker() {
  const color = useAppStore(s => s.messageMarker);
  const setColor = useAppStore(s => s.setMessageMarker);

  return (
    <div className="flex flex-wrap items-start gap-3">
      <ColorPicker value={color} onValueChange={setColor} alpha={false}>
        <ColorPickerTrigger aria-label="Choose message marker color" />
        <ColorPickerContent align="end" aria-label="Message marker color" className="relative top-auto right-auto mt-3 w-[min(280px,calc(100vw-6rem))]">
          <ColorPickerArea />
          <ColorPickerHue />
          <div className="flex gap-2"><ColorPickerHexInput /><ColorPickerSwatch /></div>
          <ColorPickerPresets aria-label="Neutral colors" className="justify-between">
            {PRESETS.map(preset => <ColorPickerPreset key={preset.value} {...preset} />)}
          </ColorPickerPresets>
          <p className="text-xs text-muted-foreground">Personalize the line beside assistant messages.</p>
        </ColorPickerContent>
      </ColorPicker>
      <button type="button" onClick={() => setColor("#737373")} className="mt-3 text-xs text-muted-foreground underline underline-offset-4">Reset</button>
    </div>
  );
}
