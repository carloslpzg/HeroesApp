import { use, useMemo } from "react"
import { useSearchParams } from "react-router"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/ui/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { CustomPagination } from "@/components/ui/custom/CustomPagination"
import { CustomBreadcrumbs } from "@/components/ui/custom/CustomBreadcrumbs"
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero"
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext"

export const HomePage = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const activeTab = searchParams.get('tab') ?? "all";
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '6';
    const category = searchParams.get('category') ?? 'all';

    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains'];
        return validTabs.includes(activeTab) ? activeTab : 'all';
    }, [activeTab])

    const { favoriteCount, favorites } = use(FavoriteHeroContext)

    const { data: heroesResponse } = usePaginatedHero(+page, +limit, category)
    const { data: summary } = useHeroSummary();

    return (
        <>
            <>
                {/* Header */}
                <CustomJumbotron
                    title='Universo de SuperHéroes'
                    description="Descubre, explora y administra super héroes y villanos"
                />
                <CustomBreadcrumbs currentPage="Super Héroes" />
                {/* Stats Dashboard */}
                <HeroStats />

                {/* Controls */}


                {/* Advanced Filters */}


                {/* Tabs */}
                <Tabs value={selectedTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'all');
                                prev.set('category', 'all');
                                prev.set('page', '1');
                                return prev;
                            })}
                            value="all">All Characters ({summary?.totalHeroes})</TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'favorites');
                                prev.set('page', '1');
                                return prev;
                            })}
                            value="favorites" className="flex items-center gap-2">
                            Favorites ({favoriteCount})
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'heroes');
                                prev.set('category', 'hero');
                                prev.set('page', '1');
                                return prev;
                            })}
                            value="heroes">Heroes ({summary?.heroCount})</TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'villains');
                                prev.set('category', 'villain');
                                prev.set('page', '1');
                                return prev;
                            })}
                            value="villains">Villains ({summary?.villainCount})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="favorites">
                        <HeroGrid heroes={favorites} />
                    </TabsContent>
                    <TabsContent value="heroes">
                        <h1>Héroes</h1>
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="villains">
                        <h1>Villanos</h1>
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                </Tabs>

                {/* Pagination */}
                {
                    selectedTab !== 'favorites' && (
                        <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
                    )
                }
            </>
        </>
    )
}