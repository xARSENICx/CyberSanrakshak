import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableHeader,
	TableRow,
	TableHead,
	TableCell,
} from "./ui/table";
import { Input } from "./ui/input";

const OpenPorts = ({ data }: any) => {
	// State to manage the current page
	const [currentPage, setCurrentPage] = useState(1);

	// State to manage the search query
	const [searchQuery, setSearchQuery] = useState("");

	// Number of entries per page
	const entriesPerPage = 15;

	// Filter the data based on the search query
	const filteredData = data?.filter(
		(element: any) =>
			[element.process_name, element.port]
				.map((field) => field?.toString().toLowerCase()) // Convert fields to string and lowercase
				.some((field) => field.includes(searchQuery.toLowerCase())) // Check if any field includes the search query
	);

	// Calculate the index of the first and last entries on the current page
	const indexOfLastEntry = currentPage * entriesPerPage;
	const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

	// Slice the filtered data for the current page
	const currentData = filteredData?.slice(indexOfFirstEntry, indexOfLastEntry);

	// Total number of pages for filtered data
	const totalPages = Math.ceil(filteredData?.length / entriesPerPage);

	// Handler for changing pages
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	return (
		<div>
			{/* Search Bar */}
			<div className='mb-4 max-w-[75vw]'>
				<Input
					type='text'
					placeholder='Search by Process Name or Port...'
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						setCurrentPage(1); // Reset to page 1 on search
					}}
					className='w-full'
				/>
			</div>

			{/* Table */}
			<div className='rounded-md max-w-[75vw] border text-xs scroll-auto'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Process ID</TableHead>
							<TableHead>Process Name</TableHead>
							<TableHead>Port</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentData?.length > 0 ? (
							currentData.map((element: any, index: any) => (
								<TableRow key={index}>
									<TableCell>{element.pid}</TableCell>
									<TableCell>{element.process_name}</TableCell>
									<TableCell>{element.port}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={3}
									className='text-center'>
									No matching records found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className='flex justify-center items-center mt-4 space-x-2'>
				<button
					className='px-2 py-1 border rounded disabled:opacity-50'
					disabled={currentPage === 1}
					onClick={() => handlePageChange(currentPage - 1)}>
					Previous
				</button>
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index}
						className={`px-2 py-1 border rounded ${
							currentPage === index + 1 ? "bg-blue-500 text-white" : ""
						}`}
						onClick={() => handlePageChange(index + 1)}>
						{index + 1}
					</button>
				))}
				<button
					className='px-2 py-1 border rounded disabled:opacity-50'
					disabled={currentPage === totalPages}
					onClick={() => handlePageChange(currentPage + 1)}>
					Next
				</button>
			</div>
		</div>
	);
};

export default OpenPorts;
