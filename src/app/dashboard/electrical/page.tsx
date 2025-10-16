"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ElectricalPage() {
  const [groundProtection, setGroundProtection] = useState("no");
  const [meterType, setMeterType] = useState("MT");

  const panelImages = [
    PlaceHolderImages.find((p) => p.id === "electrical-panel"),
    PlaceHolderImages.find((p) => p.id === "electrical-panel-2"),
    PlaceHolderImages.find((p) => p.id === "electrical-panel-3"),
    PlaceHolderImages.find((p) => p.id === "electrical-panel-4"),
  ].filter(Boolean);

  const cableImages = [
    PlaceHolderImages.find((p) => p.id === "cable-photo-1"),
    PlaceHolderImages.find((p) => p.id === "cable-photo-2"),
    PlaceHolderImages.find((p) => p.id === "cable-photo-3"),
    PlaceHolderImages.find((p) => p.id === "cable-photo-4"),
  ].filter(Boolean);

  const outletImages = [
    PlaceHolderImages.find((p) => p.id === "outlet-photo-1"),
    PlaceHolderImages.find((p) => p.id === "outlet-photo-2"),
    PlaceHolderImages.find((p) => p.id === "outlet-photo-3"),
    PlaceHolderImages.find((p) => p.id === "outlet-photo-4"),
  ].filter(Boolean);

  const switchImages = [
    PlaceHolderImages.find((p) => p.id === "switch-photo-1"),
    PlaceHolderImages.find((p) => p.id === "switch-photo-2"),
    PlaceHolderImages.find((p) => p.id === "switch-photo-3"),
    PlaceHolderImages.find((p) => p.id === "switch-photo-4"),
  ].filter(Boolean);

  const groundMeterImages = [
    PlaceHolderImages.find((p) => p.id === "ground-meter-1"),
    PlaceHolderImages.find((p) => p.id === "ground-meter-2"),
    PlaceHolderImages.find((p) => p.id === "ground-meter-3"),
    PlaceHolderImages.find((p) => p.id === "ground-meter-4"),
  ].filter(Boolean);

  const groundPcImages = [
    PlaceHolderImages.find((p) => p.id === "ground-pc-1"),
    PlaceHolderImages.find((p) => p.id === "ground-pc-2"),
    PlaceHolderImages.find((p) => p.id === "ground-pc-3"),
    PlaceHolderImages.find((p) => p.id === "ground-pc-4"),
  ].filter(Boolean);

  const differentialImages = [
    PlaceHolderImages.find((p) => p.id === "differential-1"),
    PlaceHolderImages.find((p) => p.id === "differential-2"),
    PlaceHolderImages.find((p) => p.id === "differential-3"),
    PlaceHolderImages.find((p) => p.id === "differential-4"),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du Compteur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup
              value={meterType}
              onValueChange={setMeterType}
              className="flex items-center gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BT" id="bt-meter" />
                <Label htmlFor="bt-meter">BT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MT" id="mt-meter" />
                <Label htmlFor="mt-meter">MT</Label>
              </div>
            </RadioGroup>

            {meterType === "MT" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="wires">Nombre de fils</Label>
                  <Select>
                    <SelectTrigger id="wires">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 fils</SelectItem>
                      <SelectItem value="4">4 fils</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amperage">Ampérage</Label>
                  <Select>
                    <SelectTrigger id="amperage">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
                        (amp) => (
                          <SelectItem key={amp} value={String(amp)}>
                            {amp} A
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Coffret Électrique</CardTitle>
            <CardDescription>
              Composants et photo du coffret principal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="components">Composants du coffret</Label>
              <Textarea
                id="components"
                placeholder="Lister les composants : disjoncteurs, interrupteurs différentiels, etc."
              />
            </div>

            <div className="space-y-4">
              <Label>Photos du coffret</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {panelImages.map((image, index) => (
                  <Card key={image!.id}>
                    <CardContent className="p-2">
                      <div className="aspect-[4/3] rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {image ? (
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            data-ai-hint={image.imageHint}
                            width={200}
                            height={150}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full mt-2"
                      >
                        <label
                          htmlFor={`panel-photo-upload-${index}`}
                          className="cursor-pointer"
                        >
                          <Upload className="mr-2 h-3 w-3" /> Importer
                          <input
                            type="file"
                            id={`panel-photo-upload-${index}`}
                            className="sr-only"
                          />
                        </label>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments-panel">Commentaires</Label>
              <Textarea
                id="comments-panel"
                placeholder="Ajouter des observations sur le coffret électrique..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Câbles Électriques</CardTitle>
            <CardDescription>Détails sur les câbles utilisés.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cable-type">Cable principal</Label>
              <Input id="cable-type" placeholder="ex: Câble armé 4x25mm²" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cable-condition">État général du câblage</Label>
              <Select>
                <SelectTrigger id="cable-condition">
                  <SelectValue placeholder="Évaluer l'état..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bon">Bon</SelectItem>
                  <SelectItem value="defectueux">Défectueux</SelectItem>
                  <SelectItem value="non_installe">Non installé</SelectItem>
                  <SelectItem value="a_remplacer">À remplacer</SelectItem>
                  <SelectItem value="manquant">Manquant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4">
              <Label>Photos des câbles</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cableImages.map((image, index) => (
                  <Card key={image!.id}>
                    <CardContent className="p-2">
                      <div className="aspect-[4/3] rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {image ? (
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            data-ai-hint={image.imageHint}
                            width={200}
                            height={150}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full mt-2"
                      >
                        <label
                          htmlFor={`cable-photo-upload-${index}`}
                          className="cursor-pointer"
                        >
                          <Upload className="mr-2 h-3 w-3" /> Importer
                          <input
                            type="file"
                            id={`cable-photo-upload-${index}`}
                            className="sr-only"
                          />
                        </label>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments-cables">Commentaires</Label>
              <Textarea
                id="comments-cables"
                placeholder="Ajouter des observations sur les câbles..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protection terre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Présence protection Terre</Label>
              <RadioGroup
                value={groundProtection}
                onValueChange={setGroundProtection}
                className="flex items-center gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="ground-yes" />
                  <Label htmlFor="ground-yes">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="ground-no" />
                  <Label htmlFor="ground-no">Non</Label>
                </div>
              </RadioGroup>
            </div>

            {groundProtection === "yes" && (
              <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                <div className="space-y-4">
                  <Label>Barrette de compteur</Label>
                  <RadioGroup
                    defaultValue="no"
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="meter-strip-yes" />
                      <Label htmlFor="meter-strip-yes">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="meter-strip-no" />
                      <Label htmlFor="meter-strip-no">Non</Label>
                    </div>
                  </RadioGroup>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {groundMeterImages.map((image, index) => (
                      <Card key={image!.id}>
                        <CardContent className="p-2">
                          <div className="aspect-[4/3] rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                            {image ? (
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                data-ai-hint={image.imageHint}
                                width={200}
                                height={150}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full mt-2"
                          >
                            <label
                              htmlFor={`ground-meter-upload-${index}`}
                              className="cursor-pointer"
                            >
                              <Upload className="mr-2 h-3 w-3" /> Importer
                              <input
                                type="file"
                                id={`ground-meter-upload-${index}`}
                                className="sr-only"
                              />
                            </label>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ground-value">Valeur Terre (Ω)</Label>
                  <Input
                    id="ground-value"
                    placeholder="ex: 10"
                    className="max-w-xs"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Terre dans la PC</Label>
                  <RadioGroup
                    defaultValue="no"
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pc-ground-yes" />
                      <Label htmlFor="pc-ground-yes">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pc-ground-no" />
                      <Label htmlFor="pc-ground-no">Non</Label>
                    </div>
                  </RadioGroup>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {groundPcImages.map((image, index) => (
                      <Card key={image!.id}>
                        <CardContent className="p-2">
                          <div className="aspect-[4/3] rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                            {image ? (
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                data-ai-hint={image.imageHint}
                                width={200}
                                height={150}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full mt-2"
                          >
                            <label
                              htmlFor={`ground-pc-upload-${index}`}
                              className="cursor-pointer"
                            >
                              <Upload className="mr-2 h-3 w-3" /> Importer
                              <input
                                type="file"
                                id={`ground-pc-upload-${index}`}
                                className="sr-only"
                              />
                            </label>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Présence du Différentiel</Label>
                  <RadioGroup
                    defaultValue="no"
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="diff-yes" />
                      <Label htmlFor="diff-yes">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="diff-no" />
                      <Label htmlFor="diff-no">Non</Label>
                    </div>
                  </RadioGroup>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {differentialImages.map((image, index) => (
                      <Card key={image!.id}>
                        <CardContent className="p-2">
                          <div className="aspect-[4/3] rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                            {image ? (
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                data-ai-hint={image.imageHint}
                                width={200}
                                height={150}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full mt-2"
                          >
                            <label
                              htmlFor={`diff-upload-${index}`}
                              className="cursor-pointer"
                            >
                              <Upload className="mr-2 h-3 w-3" /> Importer
                              <input
                                type="file"
                                id={`diff-upload-${index}`}
                                className="sr-only"
                              />
                            </label>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments-ground">Commentaires</Label>
                  <Textarea
                    id="comments-ground"
                    placeholder="Ajouter des observations sur la protection terre..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Les prises electriques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outlet-condition">État des prises</Label>
            <Select>
              <SelectTrigger id="outlet-condition">
                <SelectValue placeholder="Évaluer l'état..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bon">Bon</SelectItem>
                <SelectItem value="defectueux">Défectueux</SelectItem>
                <SelectItem value="non_installe">Non installé</SelectItem>
                <SelectItem value="a_remplacer">À remplacer</SelectItem>
                <SelectItem value="manquant">Manquant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4">
            <Label>Photos des prises</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {outletImages.map((image, index) => (
                <Card key={image!.id}>
                  <CardContent className="p-2">
                    <div className="aspect-[4/3] rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                      {image ? (
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          data-ai-hint={image.imageHint}
                          width={200}
                          height={150}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full mt-2"
                    >
                      <label
                        htmlFor={`outlet-photo-upload-${index}`}
                        className="cursor-pointer"
                      >
                        <Upload className="mr-2 h-3 w-3" /> Importer
                        <input
                          type="file"
                          id={`outlet-photo-upload-${index}`}
                          className="sr-only"
                        />
                      </label>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments-outlets">Commentaires</Label>
            <Textarea
              id="comments-outlets"
              placeholder="Ajouter des observations sur les prises électriques..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Les interrupteurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="switch-reference">Référence</Label>
              <Input id="switch-reference" placeholder="ex: INT-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="switch-location">Localisation</Label>
              <Input
                id="switch-location"
                placeholder="ex: Bureau du directeur"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="switch-type">Type d'interrupteur</Label>
              <Input id="switch-type" placeholder="ex: Va-et-vient" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="switch-order">Ordre</Label>
              <Input id="switch-order" type="number" placeholder="ex: 1" />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="switch-condition">État des interrupteurs</Label>
            <Select>
              <SelectTrigger id="switch-condition">
                <SelectValue placeholder="Évaluer l'état..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bon">Bon</SelectItem>
                <SelectItem value="defectueux">Défectueux</SelectItem>
                <SelectItem value="non_installe">Non installé</SelectItem>
                <SelectItem value="a_remplacer">À remplacer</SelectItem>
                <SelectItem value="manquant">Manquant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4">
            <Label>Photos des interrupteurs</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {switchImages.map((image, index) => (
                <Card key={image!.id}>
                  <CardContent className="p-2">
                    <div className="aspect-[4/3] rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                      {image ? (
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          data-ai-hint={image.imageHint}
                          width={200}
                          height={150}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full mt-2"
                    >
                      <label
                        htmlFor={`switch-photo-upload-${index}`}
                        className="cursor-pointer"
                      >
                        <Upload className="mr-2 h-3 w-3" /> Importer
                        <input
                          type="file"
                          id={`switch-photo-upload-${index}`}
                          className="sr-only"
                        />
                      </label>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments-switches">Commentaires</Label>
            <Textarea
              id="comments-switches"
              placeholder="Ajouter des observations sur les interrupteurs..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer l'Installation
        </Button>
      </div>
    </div>
  );
}
