const getEmptyBlocks = () => {
  const blocks = wp.data.select("core/block-editor").getBlocks();
  const validateBlockList = (blockList) => {
    let emptyBlocks = [];
    for (let block of blockList) {
      if (block.name === "core/spacer") {
        continue;
      }
      if (block.name === "core/image") {
        if (!block.attributes.link && !block.attributes.url && !block.attributes.id) {
          emptyBlocks.push(block);
        }
        continue;
      }
      if (block.name === "core/gallery") {
        if (!block.innerBlocks.length) {
          emptyBlocks.push(block);
          continue;
        }
      }
      if (block.innerBlocks.length) {
        const emptyInnerBlocks = validateBlockList(block.innerBlocks);
        if (emptyInnerBlocks.length === block.innerBlocks.length) {
          emptyBlocks.push(block);
        } else {
          emptyBlocks = [...emptyBlocks, ...validateBlockList(block.innerBlocks)];
        }
      } else {
        const content = document.querySelector("#block-"+block.clientId);
        if (content.innerText.replace(/\s/g,"").length === 0) {
          emptyBlocks.push(block);
        }
      }
    }
    return emptyBlocks;
  };
  const list = validateBlockList(blocks); 
  return list;
};

const validationRules = [
  {
    test: (content) => ([...content.querySelectorAll("h1")].length <= 1),
    noticeMessage: "Le document contient plus d'un titre de niveau 1 (h1). Supprimez les titres inutiles ou transformez-les en titre de niveau inférieur.",
    noticeType: "error",
    postType: ["*"]
  },
  {
    test: (content) => ([...content.querySelectorAll("h1")].length > 0),
    noticeMessage: "Le document ne contient pas de titre de niveau 1 (h1). Ajoutez un titre ou modifiez un titre de niveau inférieur.",
    noticeType: "error",
    postType: ["page"]
  },
  {
    test: () => getEmptyBlocks().length === 0,
    noticeMessage: "Certains blocs de contenus sont vides. Cela nuit aux performances ainsi qu'à l'accessibilité, et donc au référencement. Ce problème peut être corrigé automatiquement.",
    noticeType: "error",
    noticeActions: [{
      label: "Corriger",
      variant: "primary",
      onClick: async () => {
        const emptyBlocks = getEmptyBlocks();
        for (let block of emptyBlocks) {
          try {
            await wp.data.dispatch("core/block-editor").removeBlock(block.clientId);
          } catch {
            /* eslint-disable no-console */
            console.warn("block couldn't be removed...", block);
            /* eslint-enable no-console */
          }
        }
        validatePost(document.querySelector("#validateBtn"));
      }
    }],
    postType: ["*"]
  },
  {
    test: (content) => [...content.querySelectorAll("h2:not(h1 ~ h2), h3:not(h2 ~ h3), h4:not(h3 ~ h4), h5:not(h4 ~ h5), h6:not(h5 ~ h6)")].length === 0,
    noticeMessage: "La hiérarchie de titres du document n'est pas cohérente. Certains titres ne sont pas précédés par un titre de niveau supérieur : Par exemple, un titre de niveau 3 apparaît dans le document sans qu'il n'existe de titre de niveau 2. Changez les niveaux de titre.",
    noticeType: "error",
    postType: ["page"]
  },
  {
    test: (content) => [...content.querySelectorAll("h3:not(h2 ~ h3), h4:not(h3 ~ h4), h5:not(h4 ~ h5), h6:not(h5 ~ h6)")].length === 0,
    noticeMessage: "La hiérarchie de titres du document n'est pas cohérente. Certains titres ne sont pas précédés par un titre de niveau supérieur : Par exemple, un titre de niveau 3 apparaît dans le document sans qu'il n'existe de titre de niveau 2. Changez les niveaux de titre.",
    noticeType: "error",
    postType: ["post"]
  },
  {
    test: (content) => [...content.querySelectorAll("img")]
      .filter(e => e.getAttribute("alt").replace(/\s/g, "") === "")
      .length === 0,
    noticeMessage: "Certaines images ne sont pas accompagnées de texte alternatif. Cela peut poser des problèmes d'accessibilité et nuire au référencement de ces images.",
    noticeType: "warning",
    postType: ["*"]
  },
  {
    test: () => {
      const metaTitleField = document.querySelector("#autodescription_title")
      || document.querySelector(".edit-post-visual-editor__post-title-wrapper h1");
      const metaTitle = metaTitleField.getAttribute("value")
      || metaTitleField.getAttribute("placeholder")
      || metaTitleField.innerText;
      return metaTitle.length >= 35;
    },
    noticeMessage: "Le titre du document est trop court. Un bon titre doit décrire le contenu du document et donner envie au visiteur de cliquer dessus quand il le voit dans une liste de résultats d'un moteur de recherche.",
    noticeType: "warning",
    postType: ["*"]
  },
  {
    test: () => {
      const metaTitleField = document.querySelector("#autodescription_title")
      || document.querySelector(".edit-post-visual-editor__post-title-wrapper h1");
      const metaTitle = metaTitleField.getAttribute("value")
      || metaTitleField.getAttribute("placeholder")
      || metaTitleField.innerText;
      return metaTitle.length <= 65;
    },
    noticeMessage: "Le titre du document est trop long. Un titre trop long sera tronqué lorsque la page apparaîtra dans les résultats d'un moteur de recherche.",
    noticeType: "warning",
    postType: ["*"]
  },
  {
    test: (content) => content.body.innerText.split(/\s/).length >= 200,
    noticeMessage: "Le contenu du document est trop court. Un contenu trop pauvre est peu engageant pour vos visiteurs et a un impact négatif sur le référencement du site.",
    noticeType: "warning",
    postType: ["*"]
  }
];
const getContent = () => {
  return (new DOMParser()).parseFromString(wp.data.select("core/editor").getEditedPostContent(), "text/html");
};
const validateContent = () => {
  const content = getContent();
  const validation = {
    success: true,
    noticeType: "success",
    noticeMessage: "Le contenu valide les critères de structuration SEO ; vous pouvez publier"
  };

  for (let rule of validationRules) {
    if (!(rule.postType.includes("*")
      || rule.postType.includes(wp.data.select("core/editor").getCurrentPostType()))) {
      continue;
    }
    if (!rule.test(content)) {
      validation.noticeType = rule.noticeType;
      validation.noticeMessage = rule.noticeMessage;
      validation.noticeActions = rule.noticeActions;
      validation.success = (rule.noticeType !== "error");
      return validation;
    }
  }
  return validation;
};

const showNotice = (validation) => {
  wp.data.dispatch("core/notices").removeNotice("gco-gut-lock");
  wp.data.dispatch("core/notices").createNotice(
    validation.noticeType,
    validation.noticeMessage,
    { id: "gco-gut-lock", isDismissible: validation.noticeType !== "error", actions: validation.noticeActions }
  );
};

const validatePost = (validateBtn) => {
  const validation = validateContent();
  if (validation.success) {
    validateBtn.classList.remove("not-valid");
    validateBtn.classList.add("is-valid");
  } else {
    validateBtn.classList.remove("is-valid");
    validateBtn.classList.add("not-valid");
  }
  showNotice(validation);
};

const subscribeToEditorChanges = (validationBtn) => {
  let postContent = "";
  wp.data.subscribe(() => {
    const content = wp.data.select("core/editor").getEditedPostContent();
    if (content !== postContent) {
      try {
        if (wp.data.select("core/notices").getNotices()
          .find(e => (e.id === "gco-gut-lock") && (e.status === "success"))) {
          wp.data.dispatch("core/notices").removeNotice("gco-gut-lock");
        }
      } catch {
        /* eslint-disable no-console */
        console.warn("no notice to remove");
        /* eslint-enable no-console */
      }
      validationBtn.classList.remove("is-valid");
      validationBtn.classList.add("not-valid");
      postContent = content;
    }
  });
};

const addValidationButton = (() => {
  const saveBtn = document.querySelector(".edit-post-header button.editor-post-publish-button") || document.querySelector(".edit-post-header button.editor-post-publish-button__button");
  if (saveBtn === null) {
    setTimeout(() => {
      addValidationButton();
    }, 100);
    return;
  }
  const validateBtn = document.createElement("button");
  validateBtn.setAttribute("id", "validateBtn");
  validateBtn.setAttribute("class", "components-button is-secondary not-valid");
  validateBtn.innerText = "Valider";
  validateBtn.addEventListener("click", () => {
    validatePost(validateBtn);
  });
  saveBtn.parentElement.insertBefore(validateBtn, saveBtn);
  subscribeToEditorChanges(validateBtn);
});

export { addValidationButton };
