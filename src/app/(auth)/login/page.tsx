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

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center items-center gap-2">
                    <Waves className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-bold">EnerAudit</CardTitle>
                </div>
                <CardDescription>Connectez-vous pour accéder à votre tableau de bord</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                        Mot de passe oublié?
                    </Link>
                    </div>
                    <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                    Se connecter
                </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                Vous n'avez pas de compte?{" "}
                <Link href="/signup" className="underline" prefetch={false}>
                    S'inscrire
                </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
