import { redirect } from "next/navigation";
import BlogPage from "./blog/page";
import ExperiencePage from "./experience/page";
import FeaturePage from "./feature/page";
import LegacyHomePage from "./home/page";

jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

test("redirects retired placeholder routes to supported portfolio routes", () => {
  LegacyHomePage();
  expect(redirect).toHaveBeenLastCalledWith("/");

  ExperiencePage();
  expect(redirect).toHaveBeenLastCalledWith("/skills");

  BlogPage();
  expect(redirect).toHaveBeenLastCalledWith("/projects");

  FeaturePage();
  expect(redirect).toHaveBeenLastCalledWith("/");
});
