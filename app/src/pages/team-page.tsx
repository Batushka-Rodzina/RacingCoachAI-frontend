// src/pages/team-page.tsx
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import {
	dummyTeam,
	dummyPendingInvites,
	teamColorPresets,
	countries,
	getRoleLabel,
	getRoleColor,
	getFlagEmoji,
	formatDate,
	formatTimeAgo,
} from '../data/dummyTeam'
import type { TeamMember, PendingInvite, TeamAnnouncement } from '../data/dummyTeam'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	carbonLight: '#2d2d2d',
	text: '#e5e5e5',
	textMuted: '#737373',
	success: '#22c55e',
	warning: '#f59e0b',
	danger: '#ef4444',
}

type TabType = 'members' | 'announcements' | 'settings'

const TeamPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabType>('members')
	const [showInviteModal, setShowInviteModal] = useState(false)
	const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
	const [showMemberModal, setShowMemberModal] = useState<TeamMember | null>(null)

	// Simulate having a team (set to false to show "Create Team" view)
	const [hasTeam] = useState(true)
	const team = dummyTeam
	const pendingInvites = dummyPendingInvites
	const currentUserId = '1' // Andrii is the owner

	const currentUserRole = team.members.find(m => m.id === currentUserId)?.role || 'member'
	const canManage = currentUserRole === 'owner' || currentUserRole === 'manager'
	const isOwner = currentUserRole === 'owner'

	// Sort members by iRating for ranking
	const sortedMembers = [...team.members].sort((a, b) => b.iRating - a.iRating)

	if (!hasTeam) {
		return (
			<div className="flex min-h-screen bg-neutral-950 text-white">
				<Sidebar activeTab="team" />
				<NoTeamView onCreateTeam={() => setShowCreateTeamModal(true)} />
				{showCreateTeamModal && (
					<CreateTeamModal onClose={() => setShowCreateTeamModal(false)} />
				)}
			</div>
		)
	}

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-x-hidden">
			{/* Styles */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Michroma&family=JetBrains+Mono:wght@400;500&display=swap');
				
				.carbon-bg {
					background-color: #0a0a0a;
					background-image: 
						linear-gradient(45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(-45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #0f0f0f 75%),
						linear-gradient(-45deg, transparent 75%, #0f0f0f 75%);
					background-size: 4px 4px;
				}

				.carbon-card {
					background-color: rgba(26, 26, 26, 0.6);
					background-image: 
						linear-gradient(45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(-45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%),
						linear-gradient(-45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%);
					background-size: 4px 4px;
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.02);
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 107, 0, 0.3);
					border-radius: 3px;
				}

				.tab-active {
					background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%);
					color: #000;
				}

				.member-row:hover {
					background: rgba(255, 107, 0, 0.05);
				}
			`}</style>

			{/* Sidebar */}
			<Sidebar activeTab="team" />

			{/* Main Content */}
			<main className="flex-1 p-8 overflow-y-auto custom-scrollbar carbon-bg relative">
				{/* Background gradient */}
				<div 
					className="fixed inset-0 pointer-events-none z-0"
					style={{
						background: `
							radial-gradient(ellipse at 20% 0%, ${team.primaryColor}08 0%, transparent 50%),
							radial-gradient(ellipse at 80% 100%, rgba(212, 175, 55, 0.02) 0%, transparent 50%)
						`
					}}
				/>

				<div className="relative z-10 max-w-7xl mx-auto space-y-8">
					
					{/* === TEAM HEADER === */}
					<section 
						className="carbon-card rounded-2xl p-6 overflow-hidden"
						style={{ border: `1px solid ${team.primaryColor}30` }}
					>
						<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
							{/* Team Logo/Avatar */}
							<div 
								className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black"
								style={{ 
									background: `linear-gradient(135deg, ${team.primaryColor}30 0%, ${team.secondaryColor}30 100%)`,
									border: `2px solid ${team.primaryColor}50`,
									color: team.primaryColor,
									fontFamily: 'Bebas Neue, sans-serif'
								}}
							>
								{team.tag}
							</div>

							{/* Team Info */}
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-1">
									<h1 
										className="text-3xl md:text-4xl font-black uppercase tracking-wide"
										style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
									>
										{team.name}
									</h1>
									<span className="text-2xl">{getFlagEmoji(team.countryCode)}</span>
								</div>
								<div className="flex items-center gap-4 text-sm" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
									<span>{team.members.length} members</span>
									<span>•</span>
									<span>Est. {formatDate(team.createdAt)}</span>
								</div>
							</div>

							{/* Team Stats */}
							<div className="flex gap-6">
								<div className="text-center">
									<p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
										Avg iRating
									</p>
									<p className="text-2xl font-bold" style={{ color: team.primaryColor, fontFamily: 'JetBrains Mono, monospace' }}>
										{Math.round(team.members.reduce((sum, m) => sum + m.iRating, 0) / team.members.length).toLocaleString()}
									</p>
								</div>
								<div className="w-px bg-white/10" />
								<div className="text-center">
									<p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
										Total Podiums
									</p>
									<p className="text-2xl font-bold" style={{ color: COLORS.gold, fontFamily: 'JetBrains Mono, monospace' }}>
										{team.members.reduce((sum, m) => sum + m.podiums, 0)}
									</p>
								</div>
							</div>
						</div>

						{/* Team Colors Bar */}
						<div 
							className="mt-6 h-1 rounded-full overflow-hidden"
							style={{ background: `linear-gradient(90deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)` }}
						/>
					</section>

					{/* === TABS === */}
					<div className="flex gap-2">
						{(['members', 'announcements', 'settings'] as TabType[]).map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab ? 'tab-active' : ''}`}
								style={{ 
									backgroundColor: activeTab === tab ? undefined : 'rgba(0, 0, 0, 0.3)',
									color: activeTab === tab ? '#000' : COLORS.textMuted,
									fontFamily: 'DM Sans, sans-serif',
									border: activeTab === tab ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
								}}
							>
								{tab === 'members' && `Members (${team.members.length})`}
								{tab === 'announcements' && 'Announcements'}
								{tab === 'settings' && 'Settings'}
							</button>
						))}
					</div>

					{/* === MEMBERS TAB === */}
					{activeTab === 'members' && (
						<div className="space-y-6">
							{/* Actions */}
							{canManage && (
								<div className="flex justify-end">
									<button
										onClick={() => setShowInviteModal(true)}
										className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
										style={{ 
											backgroundColor: COLORS.primary,
											color: '#000',
											fontFamily: 'DM Sans, sans-serif'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = COLORS.primaryHover
											e.currentTarget.style.transform = 'translateY(-2px)'
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = COLORS.primary
											e.currentTarget.style.transform = 'translateY(0)'
										}}
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
										</svg>
										Invite Member
									</button>
								</div>
							)}

							{/* Members Table */}
							<div 
								className="carbon-card rounded-2xl overflow-hidden"
								style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
							>
								{/* Table Header */}
								<div 
									className="grid grid-cols-12 gap-4 px-6 py-4 text-xs uppercase tracking-wider font-semibold"
									style={{ 
										color: COLORS.textMuted, 
										fontFamily: 'DM Sans, sans-serif',
										backgroundColor: 'rgba(0, 0, 0, 0.3)'
									}}
								>
									<div className="col-span-1">#</div>
									<div className="col-span-4">Driver</div>
									<div className="col-span-2">Role</div>
									<div className="col-span-2 text-right">iRating</div>
									<div className="col-span-2 text-right">Podiums</div>
									<div className="col-span-1"></div>
								</div>

								{/* Table Rows */}
								<div className="divide-y divide-white/5">
									{sortedMembers.map((member, index) => (
										<MemberRow 
											key={member.id}
											member={member}
											rank={index + 1}
											isCurrentUser={member.id === currentUserId}
											canManage={canManage && member.id !== currentUserId}
											isOwner={isOwner}
											teamColor={team.primaryColor}
											onClick={() => setShowMemberModal(member)}
										/>
									))}
								</div>
							</div>

							{/* Pending Invites */}
							{canManage && pendingInvites.length > 0 && (
								<div 
									className="carbon-card rounded-2xl p-6"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<h3 
										className="text-lg font-black uppercase tracking-wide mb-4"
										style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
									>
										Pending Invites
									</h3>
									<div className="space-y-3">
										{pendingInvites.map((invite) => (
											<PendingInviteRow key={invite.id} invite={invite} />
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{/* === ANNOUNCEMENTS TAB === */}
					{activeTab === 'announcements' && (
						<div className="space-y-6">
							{/* New Announcement */}
							{canManage && (
								<NewAnnouncementForm teamColor={team.primaryColor} />
							)}

							{/* Announcements List */}
							<div className="space-y-4">
								{team.announcements.map((announcement) => (
									<AnnouncementCard 
										key={announcement.id} 
										announcement={announcement}
										teamColor={team.primaryColor}
									/>
								))}
							</div>
						</div>
					)}

					{/* === SETTINGS TAB === */}
					{activeTab === 'settings' && (
						<TeamSettingsTab 
							team={team} 
							isOwner={isOwner}
							canManage={canManage}
						/>
					)}
				</div>
			</main>

			{/* === MODALS === */}
			{showInviteModal && (
				<InviteModal 
					inviteCode={team.inviteCode}
					teamColor={team.primaryColor}
					onClose={() => setShowInviteModal(false)} 
				/>
			)}

			{showMemberModal && (
				<MemberDetailModal 
					member={showMemberModal}
					teamColor={team.primaryColor}
					canManage={canManage && showMemberModal.id !== currentUserId}
					isOwner={isOwner}
					onClose={() => setShowMemberModal(null)}
				/>
			)}

			{showCreateTeamModal && (
				<CreateTeamModal onClose={() => setShowCreateTeamModal(false)} />
			)}
		</div>
	)
}

// === MEMBER ROW COMPONENT ===
interface MemberRowProps {
	member: TeamMember
	rank: number
	isCurrentUser: boolean
	canManage: boolean
	isOwner: boolean
	teamColor: string
	onClick: () => void
}

const MemberRow: React.FC<MemberRowProps> = ({ member, rank, isCurrentUser, teamColor, onClick }) => (
	<div 
		className="grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all duration-200 member-row"
		style={{ 
			borderLeft: isCurrentUser ? `3px solid ${teamColor}` : '3px solid transparent',
			backgroundColor: isCurrentUser ? `${teamColor}08` : 'transparent'
		}}
		onClick={onClick}
	>
		{/* Rank */}
		<div className="col-span-1 flex items-center">
			<span 
				className="text-sm font-bold"
				style={{ 
					color: rank === 1 ? COLORS.gold : rank === 2 ? '#a8a8a8' : rank === 3 ? '#cd7f32' : COLORS.textMuted,
					fontFamily: 'JetBrains Mono, monospace'
				}}
			>
				{rank}
			</span>
		</div>

		{/* Driver */}
		<div className="col-span-4 flex items-center gap-3">
			<div className="relative">
				<span className="text-lg">{getFlagEmoji(member.countryCode)}</span>
				{member.online && (
					<div 
						className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-neutral-900"
						style={{ backgroundColor: COLORS.success }}
					/>
				)}
			</div>
			<div>
				<p 
					className="text-sm font-semibold"
					style={{ color: isCurrentUser ? teamColor : COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
				>
					{member.name}
					{isCurrentUser && <span className="ml-2 text-xs opacity-60">(You)</span>}
				</p>
				<p className="text-xs" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
					Joined {formatDate(member.joinedAt)}
				</p>
			</div>
		</div>

		{/* Role */}
		<div className="col-span-2 flex items-center">
			<span 
				className="text-xs font-semibold px-3 py-1 rounded-full"
				style={{ 
					backgroundColor: `${getRoleColor(member.role)}20`,
					color: getRoleColor(member.role),
					fontFamily: 'DM Sans, sans-serif'
				}}
			>
				{getRoleLabel(member.role)}
			</span>
		</div>

		{/* iRating */}
		<div className="col-span-2 flex items-center justify-end">
			<span 
				className="text-sm font-bold"
				style={{ color: teamColor, fontFamily: 'JetBrains Mono, monospace' }}
			>
				{member.iRating.toLocaleString()}
			</span>
		</div>

		{/* Podiums */}
		<div className="col-span-2 flex items-center justify-end">
			<span 
				className="text-sm"
				style={{ color: COLORS.text, fontFamily: 'JetBrains Mono, monospace' }}
			>
				 {member.podiums}
			</span>
		</div>

		{/* Arrow */}
		<div className="col-span-1 flex items-center justify-end">
			<svg className="w-4 h-4" fill="none" stroke={COLORS.textMuted} viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
			</svg>
		</div>
	</div>
)

// === PENDING INVITE ROW ===
const PendingInviteRow: React.FC<{ invite: PendingInvite }> = ({ invite }) => (
	<div 
		className="flex items-center justify-between p-4 rounded-xl"
		style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
	>
		<div>
			<p className="text-sm font-semibold" style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>
				{invite.email}
			</p>
			<p className="text-xs" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
				Sent {formatTimeAgo(invite.sentAt)}
			</p>
		</div>
		<div className="flex items-center gap-3">
			<span 
				className="text-xs px-3 py-1 rounded-full"
				style={{ backgroundColor: `${COLORS.warning}20`, color: COLORS.warning, fontFamily: 'DM Sans, sans-serif' }}
			>
				Pending
			</span>
			<button 
				className="text-xs font-semibold transition-colors duration-200"
				style={{ color: COLORS.danger }}
			>
				Cancel
			</button>
		</div>
	</div>
)

// === ANNOUNCEMENT CARD ===
interface AnnouncementCardProps {
	announcement: TeamAnnouncement
	teamColor: string
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, teamColor }) => (
	<div 
		className="carbon-card rounded-2xl p-6"
		style={{ 
			border: announcement.pinned ? `1px solid ${teamColor}30` : '1px solid rgba(255, 255, 255, 0.05)',
			boxShadow: announcement.pinned ? `0 0 20px ${teamColor}10` : 'none'
		}}
	>
		{announcement.pinned && (
			<div 
				className="flex items-center gap-2 mb-3 text-xs font-semibold"
				style={{ color: teamColor, fontFamily: 'DM Sans, sans-serif' }}
			>
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
				</svg>
				Pinned
			</div>
		)}
		<p 
			className="text-sm leading-relaxed mb-4"
			style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
		>
			{announcement.content}
		</p>
		<div className="flex items-center gap-2 text-xs" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
			<span className="font-semibold" style={{ color: teamColor }}>{announcement.authorName}</span>
			<span>•</span>
			<span>{formatTimeAgo(announcement.createdAt)}</span>
		</div>
	</div>
)

// === NEW ANNOUNCEMENT FORM ===
const NewAnnouncementForm: React.FC<{ teamColor: string }> = ({ teamColor }) => {
	const [content, setContent] = useState('')

	return (
		<div 
			className="carbon-card rounded-2xl p-6"
			style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
		>
			<h3 
				className="text-lg font-black uppercase tracking-wide mb-4"
				style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
			>
				Post Announcement
			</h3>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Write a message to your team..."
				rows={3}
				className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200"
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0.3)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					color: COLORS.text,
					fontFamily: 'DM Sans, sans-serif',
				}}
				onFocus={(e) => e.target.style.borderColor = `${teamColor}50`}
				onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
			/>
			<div className="flex justify-end mt-4">
				<button
					disabled={!content.trim()}
					className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
					style={{ 
						backgroundColor: teamColor,
						color: '#000',
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					Post
				</button>
			</div>
		</div>
	)
}

// === TEAM SETTINGS TAB ===
interface TeamSettingsTabProps {
	team: typeof dummyTeam
	isOwner: boolean
	canManage: boolean
}

const TeamSettingsTab: React.FC<TeamSettingsTabProps> = ({ team, isOwner }) => (
	<div className="space-y-6">
		{/* Invite Code */}
		<div 
			className="carbon-card rounded-2xl p-6"
			style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
		>
			<h3 
				className="text-lg font-black uppercase tracking-wide mb-4"
				style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
			>
				Invite Code
			</h3>
			<div className="flex items-center gap-4">
				<div 
					className="flex-1 px-4 py-3 rounded-xl text-lg font-mono tracking-widest"
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: team.primaryColor }}
				>
					{team.inviteCode}
				</div>
				<button
					className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
					style={{ 
						backgroundColor: 'rgba(255, 255, 255, 0.05)',
						color: COLORS.text,
						border: '1px solid rgba(255, 255, 255, 0.1)',
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					Copy
				</button>
				{isOwner && (
					<button
						className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
						style={{ 
							backgroundColor: 'rgba(255, 255, 255, 0.05)',
							color: COLORS.textMuted,
							border: '1px solid rgba(255, 255, 255, 0.1)',
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						Regenerate
					</button>
				)}
			</div>
		</div>

		{/* Team Info */}
		{isOwner && (
			<div 
				className="carbon-card rounded-2xl p-6"
				style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
			>
				<h3 
					className="text-lg font-black uppercase tracking-wide mb-6"
					style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
				>
					Team Settings
				</h3>
				<div className="space-y-4">
					{/* Team Name */}
					<div>
						<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
							Team Name
						</label>
						<input
							type="text"
							defaultValue={team.name}
							className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.3)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								color: COLORS.text,
								fontFamily: 'DM Sans, sans-serif',
							}}
						/>
					</div>

					{/* Team Tag */}
					<div>
						<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
							Team Tag (3-4 letters)
						</label>
						<input
							type="text"
							defaultValue={team.tag}
							maxLength={4}
							className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 uppercase"
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.3)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								color: COLORS.text,
								fontFamily: 'JetBrains Mono, monospace',
							}}
						/>
					</div>

					{/* Colors */}
					<div>
						<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
							Team Colors
						</label>
						<div className="flex flex-wrap gap-2">
							{teamColorPresets.map((preset) => (
								<button
									key={preset.name}
									className="w-10 h-10 rounded-xl transition-all duration-200"
									style={{ 
										background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
										border: team.primaryColor === preset.primary ? '2px solid white' : '2px solid transparent'
									}}
									title={preset.name}
								/>
							))}
						</div>
					</div>

					<button
						className="w-full mt-4 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
						style={{ 
							backgroundColor: team.primaryColor,
							color: '#000',
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						Save Changes
					</button>
				</div>
			</div>
		)}

		{/* Danger Zone */}
		{isOwner && (
			<div 
				className="carbon-card rounded-2xl p-6"
				style={{ border: `1px solid ${COLORS.danger}30` }}
			>
				<h3 
					className="text-lg font-black uppercase tracking-wide mb-4"
					style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.danger }}
				>
					Danger Zone
				</h3>
				<p className="text-sm mb-4" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
					Once you delete a team, there is no going back. Please be certain.
				</p>
				<button
					className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
					style={{ 
						backgroundColor: `${COLORS.danger}20`,
						color: COLORS.danger,
						border: `1px solid ${COLORS.danger}50`,
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					Delete Team
				</button>
			</div>
		)}

		{/* Leave Team (for non-owners) */}
		{!isOwner && (
			<div 
				className="carbon-card rounded-2xl p-6"
				style={{ border: `1px solid ${COLORS.warning}30` }}
			>
				<h3 
					className="text-lg font-black uppercase tracking-wide mb-4"
					style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.warning }}
				>
					Leave Team
				</h3>
				<p className="text-sm mb-4" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
					You can rejoin later if you have an invite code.
				</p>
				<button
					className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
					style={{ 
						backgroundColor: `${COLORS.warning}20`,
						color: COLORS.warning,
						border: `1px solid ${COLORS.warning}50`,
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					Leave Team
				</button>
			</div>
		)}
	</div>
)

// === NO TEAM VIEW ===
const NoTeamView: React.FC<{ onCreateTeam: () => void }> = ({ onCreateTeam }) => (
	<main className="flex-1 flex items-center justify-center p-8 carbon-bg">
		<style>{`
			.carbon-bg {
				background-color: #0a0a0a;
				background-image: 
					linear-gradient(45deg, #0f0f0f 25%, transparent 25%),
					linear-gradient(-45deg, #0f0f0f 25%, transparent 25%),
					linear-gradient(45deg, transparent 75%, #0f0f0f 75%),
					linear-gradient(-45deg, transparent 75%, #0f0f0f 75%);
				background-size: 4px 4px;
			}
			.carbon-card {
				background-color: rgba(26, 26, 26, 0.6);
				background-image: 
					linear-gradient(45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
					linear-gradient(-45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
					linear-gradient(45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%),
					linear-gradient(-45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%);
				background-size: 4px 4px;
			}
		`}</style>
		<div 
			className="carbon-card rounded-2xl p-12 max-w-lg w-full text-center"
			style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
		>
			<div 
				className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
				style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)' }}
			>
				<svg className="w-10 h-10" fill="none" stroke={COLORS.primary} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			</div>
			<h2 
				className="text-3xl font-black uppercase tracking-wide mb-3"
				style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
			>
				No Team Yet
			</h2>
			<p 
				className="text-sm mb-8"
				style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
			>
				Create your own racing team or join an existing one with an invite code.
			</p>

			<div className="space-y-4">
				<button
					onClick={onCreateTeam}
					className="w-full px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300"
					style={{ 
						backgroundColor: COLORS.primary,
						color: '#000',
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					Create New Team
				</button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-white/10" />
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="px-4 bg-neutral-900" style={{ color: COLORS.textMuted }}>or</span>
					</div>
				</div>

				<div className="flex gap-3">
					<input
						type="text"
						placeholder="Enter invite code..."
						className="flex-1 px-4 py-4 rounded-xl text-sm outline-none uppercase tracking-widest"
						style={{
							backgroundColor: 'rgba(0, 0, 0, 0.3)',
							border: '1px solid rgba(255, 255, 255, 0.1)',
							color: COLORS.text,
							fontFamily: 'JetBrains Mono, monospace',
						}}
					/>
					<button
						className="px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200"
						style={{ 
							backgroundColor: 'rgba(255, 255, 255, 0.05)',
							color: COLORS.text,
							border: '1px solid rgba(255, 255, 255, 0.1)',
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						Join
					</button>
				</div>
			</div>
		</div>
	</main>
)

// === INVITE MODAL ===
interface InviteModalProps {
	inviteCode: string
	teamColor: string
	onClose: () => void
}

const InviteModal: React.FC<InviteModalProps> = ({ inviteCode, teamColor, onClose }) => {
	const [email, setEmail] = useState('')

	return (
		<div 
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
			onClick={onClose}
		>
			<div 
				className="carbon-card rounded-2xl p-8 max-w-md w-full relative"
				style={{ border: `1px solid ${teamColor}30` }}
				onClick={(e) => e.stopPropagation()}
			>
				<style>{`
					.carbon-card {
						background-color: rgba(26, 26, 26, 0.95);
						background-image: 
							linear-gradient(45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
							linear-gradient(-45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
							linear-gradient(45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%),
							linear-gradient(-45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%);
						background-size: 4px 4px;
					}
				`}</style>

				{/* Close */}
				<button 
					onClick={onClose}
					className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
					style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
				>
					<svg className="w-4 h-4" fill="none" stroke={COLORS.textMuted} viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<h2 
					className="text-2xl font-black uppercase tracking-wide mb-6"
					style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
				>
					Invite Member
				</h2>

				{/* Invite Code */}
				<div className="mb-6">
					<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
						Share Invite Code
					</label>
					<div className="flex items-center gap-3">
						<div 
							className="flex-1 px-4 py-3 rounded-xl text-center font-mono tracking-widest"
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: teamColor }}
						>
							{inviteCode}
						</div>
						<button
							className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
							style={{ 
								backgroundColor: teamColor,
								color: '#000',
								fontFamily: 'DM Sans, sans-serif'
							}}
						>
							Copy
						</button>
					</div>
				</div>

				<div className="relative mb-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-white/10" />
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="px-4" style={{ backgroundColor: '#1a1a1a', color: COLORS.textMuted }}>or send invite</span>
					</div>
				</div>

				{/* Email Invite */}
				<div>
					<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
						Invite by Email
					</label>
					<div className="flex gap-3">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="driver@email.com"
							className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.3)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								color: COLORS.text,
								fontFamily: 'DM Sans, sans-serif',
							}}
						/>
						<button
							disabled={!email.includes('@')}
							className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
							style={{ 
								backgroundColor: 'rgba(255, 255, 255, 0.05)',
								color: COLORS.text,
								border: '1px solid rgba(255, 255, 255, 0.1)',
								fontFamily: 'DM Sans, sans-serif'
							}}
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

// === MEMBER DETAIL MODAL ===
interface MemberDetailModalProps {
	member: TeamMember
	teamColor: string
	canManage: boolean
	isOwner: boolean
	onClose: () => void
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, teamColor, canManage, isOwner, onClose }) => (
	<div 
		className="fixed inset-0 z-50 flex items-center justify-center p-4"
		style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
		onClick={onClose}
	>
		<div 
			className="carbon-card rounded-2xl p-8 max-w-md w-full relative"
			style={{ border: `1px solid ${teamColor}30` }}
			onClick={(e) => e.stopPropagation()}
		>
			<style>{`
				.carbon-card {
					background-color: rgba(26, 26, 26, 0.95);
					background-image: 
						linear-gradient(45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(-45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%),
						linear-gradient(-45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%);
					background-size: 4px 4px;
				}
			`}</style>

			{/* Close */}
			<button 
				onClick={onClose}
				className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
				style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
			>
				<svg className="w-4 h-4" fill="none" stroke={COLORS.textMuted} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<div className="relative">
					<div 
						className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
						style={{ 
							backgroundColor: `${teamColor}20`,
							border: `2px solid ${teamColor}50`,
							color: teamColor,
							fontFamily: 'Bebas Neue, sans-serif'
						}}
					>
						{member.name.split(' ').map(n => n[0]).join('')}
					</div>
					{member.online && (
						<div 
							className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900"
							style={{ backgroundColor: COLORS.success }}
						/>
					)}
				</div>
				<div>
					<div className="flex items-center gap-2">
						<h2 
							className="text-2xl font-black uppercase"
							style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
						>
							{member.name}
						</h2>
						<span className="text-xl">{getFlagEmoji(member.countryCode)}</span>
					</div>
					<span 
						className="text-xs font-semibold px-3 py-1 rounded-full"
						style={{ 
							backgroundColor: `${getRoleColor(member.role)}20`,
							color: getRoleColor(member.role),
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						{getRoleLabel(member.role)}
					</span>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<StatBox label="iRating" value={member.iRating.toLocaleString()} color={teamColor} />
				<StatBox label="Safety Rating" value={member.safetyRating.toFixed(2)} color={COLORS.gold} />
				<StatBox label="Total Races" value={member.totalRaces.toString()} color={COLORS.text} />
				<StatBox label="Podiums" value={`${member.podiums}`} color={COLORS.text} />
			</div>

			{/* Best Lap */}
			{member.bestLapTime && (
				<div 
					className="p-4 rounded-xl mb-6 text-center"
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
				>
					<p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
						Best Lap (Spa)
					</p>
					<p className="text-xl font-bold" style={{ color: teamColor, fontFamily: 'JetBrains Mono, monospace' }}>
						{member.bestLapTime}
					</p>
				</div>
			)}

			{/* Joined */}
			<p className="text-xs text-center mb-6" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
				Member since {formatDate(member.joinedAt)}
			</p>

			{/* Management Actions */}
			{canManage && (
				<div className="space-y-3 pt-4 border-t border-white/10">
					{isOwner && member.role !== 'owner' && (
						<div className="flex gap-3">
							<button
								className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
								style={{ 
									backgroundColor: member.role === 'manager' ? 'rgba(255, 255, 255, 0.05)' : `${COLORS.primary}20`,
									color: member.role === 'manager' ? COLORS.textMuted : COLORS.primary,
									border: `1px solid ${member.role === 'manager' ? 'rgba(255, 255, 255, 0.1)' : `${COLORS.primary}50`}`,
									fontFamily: 'DM Sans, sans-serif'
								}}
							>
								{member.role === 'manager' ? 'Demote to Member' : 'Promote to Manager'}
							</button>
						</div>
					)}
					<button
						className="w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
						style={{ 
							backgroundColor: `${COLORS.danger}20`,
							color: COLORS.danger,
							border: `1px solid ${COLORS.danger}50`,
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						Remove from Team
					</button>
				</div>
			)}
		</div>
	</div>
)

const StatBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
	<div 
		className="p-4 rounded-xl text-center"
		style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
	>
		<p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
			{label}
		</p>
		<p className="text-lg font-bold" style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>
			{value}
		</p>
	</div>
)

// === CREATE TEAM MODAL ===
const CreateTeamModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const [name, setName] = useState('')
	const [tag, setTag] = useState('')
	const [country, setCountry] = useState('PL')
	const [selectedColor, setSelectedColor] = useState(teamColorPresets[0])

	return (
		<div 
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
			onClick={onClose}
		>
			<div 
				className="carbon-card rounded-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
				style={{ border: `1px solid ${selectedColor.primary}30` }}
				onClick={(e) => e.stopPropagation()}
			>
				<style>{`
					.carbon-card {
						background-color: rgba(26, 26, 26, 0.95);
						background-image: 
							linear-gradient(45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
							linear-gradient(-45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
							linear-gradient(45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%),
							linear-gradient(-45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%);
						background-size: 4px 4px;
					}
				`}</style>

				{/* Close */}
				<button 
					onClick={onClose}
					className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
					style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
				>
					<svg className="w-4 h-4" fill="none" stroke={COLORS.textMuted} viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<h2 
					className="text-3xl font-black uppercase tracking-wide mb-8"
					style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
				>
					Create Team
				</h2>

				{/* Preview */}
				<div 
					className="p-6 rounded-xl mb-8 text-center"
					style={{ 
						background: `linear-gradient(135deg, ${selectedColor.primary}20 0%, ${selectedColor.secondary}20 100%)`,
						border: `1px solid ${selectedColor.primary}30`
					}}
				>
					<div 
						className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center text-xl font-black"
						style={{ 
							backgroundColor: `${selectedColor.primary}30`,
							color: selectedColor.primary,
							fontFamily: 'Bebas Neue, sans-serif'
						}}
					>
						{tag || '???'}
					</div>
					<p 
						className="text-xl font-black uppercase"
						style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
					>
						{name || 'Your Team Name'}
					</p>
					<p className="text-sm" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
						{getFlagEmoji(country)} {countries.find(c => c.code === country)?.name}
					</p>
				</div>

				{/* Form */}
				<div className="space-y-5">
					{/* Team Name */}
					<div>
						<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
							Team Name *
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Soul of Racing"
							className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.3)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								color: COLORS.text,
								fontFamily: 'DM Sans, sans-serif',
							}}
						/>
					</div>

					{/* Team Tag */}
					<div>
						<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
							Team Tag (3-4 letters) *
						</label>
						<input
							type="text"
							value={tag}
							onChange={(e) => setTag(e.target.value.toUpperCase().slice(0, 4))}
							placeholder="e.g. SOR"
							maxLength={4}
							className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 uppercase tracking-widest"
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.3)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								color: COLORS.text,
								fontFamily: 'JetBrains Mono, monospace',
							}}
						/>
					</div>

					{/* Country */}
					<div>
						<label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
							Country/Region
						</label>
						<select
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer outline-none"
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.3)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								color: COLORS.text,
								fontFamily: 'DM Sans, sans-serif',
							}}
						>
							{countries.map((c) => (
								<option key={c.code} value={c.code} style={{ backgroundColor: COLORS.carbon }}>
									{getFlagEmoji(c.code)} {c.name}
								</option>
							))}
						</select>
					</div>

					{/* Colors */}
					<div>
						<label className="block text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
							Team Colors
						</label>
						<div className="flex flex-wrap gap-2">
							{teamColorPresets.map((preset) => (
								<button
									key={preset.name}
									onClick={() => setSelectedColor(preset)}
									className="w-10 h-10 rounded-xl transition-all duration-200"
									style={{ 
										background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
										border: selectedColor.name === preset.name ? '2px solid white' : '2px solid transparent',
										transform: selectedColor.name === preset.name ? 'scale(1.1)' : 'scale(1)'
									}}
									title={preset.name}
								/>
							))}
						</div>
						<p className="text-xs mt-2" style={{ color: selectedColor.primary, fontFamily: 'DM Sans, sans-serif' }}>
							{selectedColor.name}
						</p>
					</div>

					{/* Submit */}
					<button
						disabled={!name.trim() || tag.length < 2}
						className="w-full mt-6 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-50"
						style={{ 
							backgroundColor: selectedColor.primary,
							color: '#000',
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						Create Team
					</button>
				</div>
			</div>
		</div>
	)
}

export default TeamPage