import React, { useEffect } from "react";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "./ui/accordion";
import {
	Table,
	TableBody,
	TableHeader,
	TableRow,
	TableHead,
	TableCell,
} from "./ui/table";

const Interfaces = ({ data }: any) => {
	useEffect(() => {
		console.log(data[0]);
	}, []);
	return (
		<Accordion
			type='single'
			collapsible
			className='space-y-4'>
			{data.map((accordionItem: any, index: number) => (
				<AccordionItem
					key={index}
					value={`item-${index}`}>
					<AccordionTrigger>
						{accordionItem?.interface} : {accordionItem?.status}
					</AccordionTrigger>
					<AccordionContent>
						<div className='rounded-md max-w-full border text-xs overflow-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Type</TableHead>
										<TableHead>Address</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{accordionItem?.addresses.map(
										(domainItem: any, rowIndex: number) => (
											<TableRow key={rowIndex}>
												<TableCell>{domainItem.type || "-"}</TableCell>
												<TableCell>{domainItem.address || "-"}</TableCell>
											</TableRow>
										)
									)}
								</TableBody>
							</Table>
						</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
};

export default Interfaces;
