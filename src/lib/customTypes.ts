export type ListOption = {
    label: string;
    value: unknown;
}

export type DDConfig = {
    hover: string;
    height: string;
    width: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    fontWeight: string;
    header: string | null;
    footer: string | null;
    headerClick: (() => void) | null;
    footerClick: (() => void) | null;
}
