import React from "react";
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
import DomainChart from "@/components/DomainChart";

const DomainMapping = ({ data }: any) => {
	return (
		<Accordion
			type='single'
			collapsible
			className='space-y-4'>
			{data.map((accordionItem: any, index: number) => (
				<AccordionItem
					key={index}
					value={`item-${index}`}>
					<AccordionTrigger>{accordionItem.process_name}</AccordionTrigger>
					<AccordionContent>
						<div className='rounded-md max-w-full border text-xs overflow-auto'>
							<DomainChart data={accordionItem.domains} />
							{/* <Table>
								<TableHeader>
									<TableRow>
										<TableHead>Domain</TableHead>
										<TableHead>Timestamp</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{accordionItem.domains.map(
										(domainItem: any, rowIndex: number) => (
											<TableRow key={rowIndex}>
												<TableCell>{domainItem.domain || "-"}</TableCell>
												<TableCell>
													{new Date(domainItem.timestamp).toLocaleString() ||
														"-"}
												</TableCell>
											</TableRow>
										)
									)}
								</TableBody>
							</Table> */}
						</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
};

export default DomainMapping;
