import { Page, TestInfo } from "@playwright/test";
import { Wopee } from "@wopee-io/wopee.pw";

let currentPage: Page | undefined = undefined;
let currentTestInfo: TestInfo | undefined = undefined;
let currentWopee: Wopee | undefined = undefined;

export function getPage(): Page | undefined {
  return currentPage;
}

export function getTestInfo(): TestInfo | undefined {
  return currentTestInfo;
}

export function getWopee(): Wopee | undefined {
  return currentWopee;
}

export function setPage(page: Page) {
  currentPage = page;
}

export function setTestInfo(testInfo: TestInfo) {
  currentTestInfo = testInfo;
}

export function setWopee(wopee: Wopee) {
  currentWopee = wopee;
}
