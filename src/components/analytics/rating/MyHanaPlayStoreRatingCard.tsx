
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, RefreshCw } from 'lucide-react';
import { useMyHanaPlayStoreScraper } from '@/hooks/useMyHanaPlayStoreScraper';
import { Badge } from '@/components/ui/badge';

export function MyHanaPlayStoreRatingCard() {
  const { scrapeMyHanaPlayStore, scrapedData, isLoading } = useMyHanaPlayStoreScraper();

  const handleScrape = () => {
    scrapeMyHanaPlayStore();
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">MyHana Play Store Rating</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleScrape}
            disabled={isLoading}
            className="h-8 px-2"
          >
            {isLoading ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <ExternalLink className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {scrapedData ? (
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {scrapedData.rating}
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-xs text-muted-foreground">
                {scrapedData.ratingCount} reviews
              </p>
            </div>
            
            <div className="space-y-2">
              <div>
                <Badge variant="secondary" className="text-xs">
                  {scrapedData.appName}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                by {scrapedData.developer}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated: {scrapedData.lastUpdated}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => window.open('https://play.google.com/store/search?q=myhana&c=apps&hl=en', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View on Play Store
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Button
              onClick={handleScrape}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get MyHana Play Store Rating
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Click to scrape rating from Play Store
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
