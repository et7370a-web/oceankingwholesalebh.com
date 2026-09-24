export interface CutStyle {
  value: string;
  label: string;
  description: string;
}

// How the customer wants their whole fish cut/cleaned. Sent with the order as a line attribute.
export const CUT_STYLES: CutStyle[] = [
  { value: 'whole', label: 'Whole', description: 'Cleaned, uncut' },
  { value: 'fillet', label: 'Fillet', description: 'No skin, no bones' },
  { value: 'steaks', label: 'Steaks', description: 'Cut into steaks' },
  { value: 'half', label: 'Half', description: 'Cut into 2 pieces' },
  { value: 'three-pieces', label: 'Three Pieces', description: 'Cut into 3 pieces' },
  { value: 'circles', label: 'Circles', description: 'Cut into rounds' },
  { value: 'ground', label: 'Ground', description: 'Ground fish' },
];

export const DEFAULT_CUT_STYLE = CUT_STYLES[0].value;

export const getCutStyleLabel = (value: string): string =>
  CUT_STYLES.find((c) => c.value === value)?.label ?? value;
