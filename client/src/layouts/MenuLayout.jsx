import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import {
  BarChart,
  FileText,
  Settings,
  LayoutDashboard,
  Search,
  ChevronDown,
  FolderTree,
  Database,
  LineChart,
  PieChart,
  NetworkIcon,
  History
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ThemeToggle } from "@/components/theme-toggle"

const MenuLayout = ({ children }) => {
  const location = useLocation();
  const [openBiblioAnalysis, setOpenBiblioAnalysis] = useState(true);
  const [openAuthorAnalysis, setOpenAuthorAnalysis] = useState(true);
  const [openCountryAnalysis, setOpenCountryAnalysis] = useState(true);
  const [openRetractionAnalysis, setOpenRetractionAnalysis] = useState(true);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar className="border-r ">
          <SidebarHeader className="border-b px-2 py-4 pl-3">
            <h2 className="text-xl font-bold ">
              MetaInfoSci
            </h2>
            <p className='text-xs'>Visualize Trends & Analyze Facts</p>
          </SidebarHeader>

          <SidebarContent className="flex-1 pl-1">
            <SidebarMenu>
              {/* Tab 1: Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/home'}>
                  <Link to="/home" className="w-full">
                    Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Tab 2: BiblioAnalysis */}
              <SidebarMenuItem>
                <Collapsible open={openBiblioAnalysis} onOpenChange={setOpenBiblioAnalysis}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      Biblio Analysis
                      <ChevronDown className="h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Publication Analysis */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/biblio-analysis/publication-analysis">
                            Publication Analysis
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Citations Analysis */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/biblio-analysis/citations-analysis">
                            Citations Analysis
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Document Analysis */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/biblio-analysis/document-analysis">
                            Document Analysis
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Journal Analysis */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/biblio-analysis/journal-analysis">
                            Journal Analysis
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Publisher Analysis */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/biblio-analysis/publisher-analysis">
                            Publisher Analysis
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/biblio-analysis/highly-cited-papers">
                            Highly Cited Papers
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Tab 3: Author Analysis */}
              <SidebarMenuItem>
                <Collapsible open={openAuthorAnalysis} onOpenChange={setOpenAuthorAnalysis}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      Author Analysis
                      <ChevronDown className="h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Author Count */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/author-count">
                            Author Count
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/top-authors">
                            Top Authors
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Team Size */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/team-size">
                            Team Size
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Collaboration */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/collaboration">
                            Collaboration
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Centrality Measure */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/centrality-measure">
                            Centrality Measure
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Gender Analysis */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/connected-components">
                            Connected Components
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/gender-analysis">
                            Gender Analysis
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/authorship-position">
                            Authorship Position
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/author-analysis/others">
                            Others
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Tab 4: Country Analysis */}
              <SidebarMenuItem>
                <Collapsible open={openCountryAnalysis} onOpenChange={setOpenCountryAnalysis}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      Country Analysis
                      <ChevronDown className="h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Country Count */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/country-analysis/country-count">
                            Country Count
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Team Size */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/country-analysis/team-size">
                            Team Size
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Collaboration */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/country-analysis/collaboration">
                            Collaboration
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Authorship Position */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/country-analysis/authorship-position">
                            Authorship Position
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Inter-Intra Collaboration */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/country-analysis/inter-intra-collaboration">
                            Inter-Intra Collaboration
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Tab 5: Retraction Analysis */}
              <SidebarMenuItem>
                <Collapsible open={openRetractionAnalysis} onOpenChange={setOpenRetractionAnalysis}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      Retraction Analysis
                      <ChevronDown className="h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Retraction Trend */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/retraction-analysis/retraction-trend">
                            Retraction Trend
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Months to Retraction */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/retraction-analysis/months-to-retraction">
                            Months to Retraction
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Reasons Vs Count */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/retraction-analysis/reasons-vs-count">
                            Reasons Vs Count
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Tab 6: Others */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/others'}>
                  <Link to="/others" className="w-full">
                    Others
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
                afterSignOutUrl="/"
              />
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden w-full">
          <main className="w-full p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MenuLayout;
