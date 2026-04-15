import { makeAutoObservable } from "mobx";

import type { Option, SearchParams } from "./types";

export class SearchBarStore {
  query = "";
  shop: string | undefined = undefined;
  organization: string | undefined = undefined;
  shopOpen = false;
  orgOpen = false;
  filtersVisible = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setQuery(value: string) {
    this.query = value;
  }

  setShop(value: string | undefined) {
    this.shop = value;
  }

  setOrganization(value: string | undefined) {
    this.organization = value;
  }

  setShopOpen(value: boolean) {
    this.shopOpen = value;
  }

  setOrgOpen(value: boolean) {
    this.orgOpen = value;
  }

  toggleFiltersVisible() {
    this.filtersVisible = !this.filtersVisible;
  }

  toggleShopOpen() {
    this.shopOpen = !this.shopOpen;
  }

  toggleOrgOpen() {
    this.orgOpen = !this.orgOpen;
  }

  get hasFilters() {
    return Boolean(this.query || this.shop || this.organization);
  }

  get searchParams(): SearchParams {
    return {
      query: this.query,
      ...(this.shop ? { shop: this.shop } : {}),
      ...(this.organization ? { organization: this.organization } : {}),
    };
  }

  getShopLabel(shopOptions: Option[]) {
    if (!this.shop) return "Все точки";

    return shopOptions.find((option) => option.value === this.shop)?.label ?? "Все точки";
  }

  getOrganizationLabel(organizationOptions: Option[]) {
    if (!this.organization) return "Все организации";

    return (
      organizationOptions.find((option) => option.value === this.organization)?.label ??
      "Все организации"
    );
  }
}
