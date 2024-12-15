"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import type { BlockRule } from "@/types/rules";

interface BlocksTableProps {
	rules: BlockRule[];
	onStatusChange: (id: string, status: "applied" | "idle") => void;
}

export function BlocksTable({ rules, onStatusChange }: BlocksTableProps) {
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil((rules?.length ?? 0) / itemsPerPage);

	const paginatedRules =
		rules?.slice((page - 1) * itemsPerPage, page * itemsPerPage) ?? [];

	return (
		<div className='space-y-4'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Host IDs</TableHead>
						<TableHead>Host Names</TableHead>
						<TableHead>Applications</TableHead>
						<TableHead>App Category</TableHead>
						<TableHead>Time Applied</TableHead>
						<TableHead>Whitelisted Domains</TableHead>
						<TableHead>Blacklisted Domains</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginatedRules.map((rule) => (
						<TableRow key={rule.id}>
							<TableCell>{rule.hostIds?.join(", ") ?? ""}</TableCell>
							<TableCell>{rule.hostNames?.join(", ") ?? ""}</TableCell>
							<TableCell>{rule.applications?.join(", ") ?? ""}</TableCell>
							<TableCell>{rule.appCategory?.join(", ") ?? ""}</TableCell>
							<TableCell>
								{rule.timeApplied
									? new Date(rule.timeApplied).toLocaleString()
									: ""}
							</TableCell>
							<TableCell>{rule.whitelistedDomains?.join(", ") ?? ""}</TableCell>
							<TableCell>{rule.blacklistedDomains?.join(", ") ?? ""}</TableCell>
							<TableCell>
								<Switch
									checked={rule.status === "applied"}
									onCheckedChange={(checked) =>
										onStatusChange(rule.id, checked ? "applied" : "idle")
									}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
						/>
					</PaginationItem>
					{Array.from({ length: totalPages }, (_, i) => (
						<PaginationItem key={i + 1}>
							<PaginationLink
								onClick={() => setPage(i + 1)}
								isActive={page === i + 1}>
								{i + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
