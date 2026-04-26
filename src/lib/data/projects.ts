import Entropy from '../assets/images/Entropy.jpeg?enhanced';
import Csv_analyzer_MCP_server from '../assets/images/csv_mcp.png?enhanced';
import BiSync from '../assets/images/BiSync.png?enhanced';
import panda from '../assets/images/panda.jpg?enhanced';
import tiger from '../assets/images/tiger.jpg?enhanced';
import vn from '../assets/images/Gemini_Generated_Image_hpp5e9hpp5e9hpp5.png?enhanced';
import type { Picture } from '@sveltejs/enhanced-img';

export type Project = {
	title: string;
	tags: string[];
	image: Picture;
	link: string;
	colSpan: string;
	rowSpan: string;
	// aspectRatio: number;
};

export const projects: Project[] = [
  {
		title: 'BiSync',
		tags: ['React', 'Python', 'Typescript'],
		image: BiSync,
		link: 'https://stratsyn.ai/bisync',
		colSpan: 'lg:col-span-2',
		rowSpan: 'lg:row-span-2',
		// aspectRatio: 16 / 9
  },
	{
		title: 'Csv_analyzer_MCP_server',
		tags: ['Python', 'Pandas'],
		image: Csv_analyzer_MCP_server,
		link: 'https://github.com/VN-78/csv_analyzer_mcp_server',
		colSpan: 'lg:col-span-1',
		rowSpan: 'lg:row-span-1',
	},
	{
		title: 'sample',
		tags: ['design', 'development'],
		image: panda,
		link: 'https://github.com/VN-78',
		colSpan: 'lg:col-span-1',
		rowSpan: 'lg:row-span-2',
		// aspectRatio: 1
	},
	{
		title: 'tiger',
		tags: ['design', 'development'],
		image: tiger,
		link: 'https://github.com/VN-78',
		colSpan: 'lg:col-span-1',
		rowSpan: 'lg:row-span-1',
		// aspectRatio: 1
  },
  {
		title: 'sample2',
		tags: ['design', 'development'],
		image: vn,
		link: 'https://github.com/VN-78',
		colSpan: 'lg:col-span-1',
		rowSpan: 'lg:row-span-1',
		// aspectRatio: 16 / 9
	},
  {
		title: 'Entropy',
		tags: ['React', 'Python', 'DuckDB'],
		image: Entropy,
		link: 'https://github.com/VN-78/Entropy',
		// The magic properties for the Bento Grid
		colSpan: 'lg:col-span-3',
		rowSpan: 'lg:row-span-2',
		// aspectRatio: 16 / 9
	},
	// ... add 1 or 2 more
];
