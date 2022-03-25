

# Action Github permettant de mettre à jour la version du plugin ou thème.

### Inputs à fournir dans l'action du dépôt (plugin ou thème)
```
indexFolder: le_fichier_d'entrée
```
Ce fichier est par exemple `style.css` pour les thèmes ou alors le nom du fichier d'entrée du plugin `exemple-fichier.php`

---

### Outputs
```
json: liste des méta-data des commentaires modifiés

contentUpdated: le contenu du fichier avec les commentaires modifiés (nouveau fichier style.css ou nouveau fichier.php)
```

### ✅ le fichier meta-data.json est ajouté à la release. Ce fichier contient les nouvelles meta-données des commentaires.
### 🆘 Pensez à commiter le fichier modifié dans l'action github pour qu'il soit modifié sur le dépôt !

## Example usage

style.css
```
- name: Increment action step
    id: increment
    uses: maison-graciet/action-wp-metadata@master
    with:
      indexFile: 'style.css'
- name: Commit new package.json version
  run: |
    git commit package.json package-lock.json style.css -m "[bot] Updated library version"
```

ou le fichier d'entrée fichier.php
```
- name: Increment action step
    id: increment
    uses: maison-graciet/action-wp-metadata@master
    with:
      indexFile: 'gracietco-gut.php'
- name: Commit new package.json version
  run: |
    git commit package.json package-lock.json gracietco-gut.php -m "[bot] Updated library version"
```