import { render, screen } from "@testing-library/react";
import { ImageResponse } from "next/og";
import { PROJECTS } from "../_lib/projects.data";
import OpenGraphImage from "./opengraph-image";

jest.mock("next/og", () => ({
  ImageResponse: jest.fn((element: React.ReactElement, options: unknown) => ({
    element,
    options,
  })),
}));

test("builds Open Graph content from the normalized project object", async () => {
  const project = PROJECTS[0];
  const response = (await OpenGraphImage({
    params: Promise.resolve({ slug: project.slug }),
  })) as unknown as { element: React.ReactElement };

  render(response.element);

  expect(ImageResponse).toHaveBeenCalledTimes(1);
  expect(screen.getByText(project.title)).toBeInTheDocument();
  expect(screen.getByText(project.summary)).toBeInTheDocument();
  expect(screen.getByText(project.stack[0])).toBeInTheDocument();
});
