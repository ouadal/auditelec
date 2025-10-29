import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Waves } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center items-center gap-2">
                <Waves className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-bold">Medlight</CardTitle>
            </div>
            <CardDescription>Créez votre compte pour commencer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Nom complet</Label>
              <Input id="full-name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Créer un compte
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte?{" "}
            <Link href="/login" className="underline" prefetch={false}>
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
