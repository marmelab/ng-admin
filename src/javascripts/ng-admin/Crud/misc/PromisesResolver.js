export default function PromisesResolver(AdminDescription) {
    return AdminDescription.getPromisesResolver();
}

PromisesResolver.$inject = ['AdminDescription'];
